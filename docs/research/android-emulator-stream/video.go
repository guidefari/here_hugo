package main

import (
	"bufio"
	"bytes"
	"compress/zlib"
	"encoding/base64"
	"encoding/binary"
	"errors"
	"fmt"
	"hash/crc32"
	"io"
	"strconv"
	"strings"
)

type rgbFrame struct {
	w, h int
	data []byte
}

func readRGB(in *bufio.Reader) (rgbFrame, error) {
	magic, err := in.ReadSlice('\n')
	if err != nil {
		return rgbFrame{}, err
	}
	if string(magic) != "P6\n" {
		return rgbFrame{}, errors.New("invalid RGB frame")
	}
	dimensions, err := in.ReadSlice('\n')
	if err != nil {
		return rgbFrame{}, err
	}
	fields := strings.Fields(string(dimensions))
	if len(fields) != 2 {
		return rgbFrame{}, errors.New("invalid RGB dimensions")
	}
	w, _ := strconv.Atoi(fields[0])
	h, _ := strconv.Atoi(fields[1])
	depth, err := in.ReadSlice('\n')
	if err != nil {
		return rgbFrame{}, err
	}
	if w < 1 || w > 2400 || h < 1 || h > 2400 || string(depth) != "255\n" {
		return rgbFrame{}, errors.New("invalid RGB dimensions or depth")
	}
	frame := rgbFrame{w: w, h: h, data: make([]byte, w*h*3)}
	_, err = io.ReadFull(in, frame.data)
	return frame, err
}

type tiles struct {
	png, compressed bytes.Buffer
	z               *zlib.Writer
	scratch         []byte
	previous        rgbFrame
	ids             []int
	nextID          int
}

func putChunk(b *bytes.Buffer, kind string, payload []byte) {
	b.Write(binary.BigEndian.AppendUint32(nil, uint32(len(payload))))
	start := b.Len()
	b.WriteString(kind)
	b.Write(payload)
	b.Write(binary.BigEndian.AppendUint32(nil, crc32.ChecksumIEEE(b.Bytes()[start:])))
}

func (t *tiles) encode(w, h int, rgb []byte) []byte {
	t.png.Reset()
	t.compressed.Reset()
	t.z.Reset(&t.compressed)
	stride := w * 3
	n := (stride + 1) * h
	if cap(t.scratch) < n {
		t.scratch = make([]byte, n)
	}
	scan := t.scratch[:n]
	scan[0] = 0
	copy(scan[1:stride+1], rgb[:stride])
	for y := 1; y < h; y++ {
		start := y * (stride + 1)
		scan[start] = 2
		src := rgb[y*stride : (y+1)*stride]
		prev := rgb[(y-1)*stride : y*stride]
		dest := scan[start+1 : start+1+stride]
		for x, sample := range src {
			dest[x] = sample - prev[x]
		}
	}
	t.z.Write(scan)
	t.z.Close()
	t.png.WriteString("\x89PNG\r\n\x1a\n")
	var header [13]byte
	binary.BigEndian.PutUint32(header[:4], uint32(w))
	binary.BigEndian.PutUint32(header[4:8], uint32(h))
	header[8], header[9] = 8, 2
	putChunk(&t.png, "IHDR", header[:])
	putChunk(&t.png, "IDAT", t.compressed.Bytes())
	putChunk(&t.png, "IEND", nil)
	return t.png.Bytes()
}

func erase(out *strings.Builder, id int) {
	fmt.Fprintf(out, "%s_Ga=d,d=I,i=%d,q=2%s\\", esc, id, esc)
}

func (t *tiles) update(frame rgbFrame, a area, resized bool) (string, int) {
	var out strings.Builder
	const band = 8
	n := (a.rows + band - 1) / band
	if resized {
		for _, id := range t.ids {
			erase(&out, id)
		}
		t.ids = make([]int, n)
		out.WriteString(esc + "[2J")
	}
	last := -1
	dirty := make([]bool, n)
	for i := 0; i < n; i++ {
		startRow, endRow := i*band, min((i+1)*band, a.rows)
		y0, y1 := startRow*frame.h/a.rows, endRow*frame.h/a.rows
		offset, end := y0*frame.w*3, y1*frame.w*3
		dirty[i] = resized || !bytes.Equal(t.previous.data[offset:end], frame.data[offset:end])
		if dirty[i] {
			last = i
		}
	}
	if last < 0 {
		return "", 0
	}
	ackID := 0
	for i := 0; i <= last; i++ {
		if !dirty[i] {
			continue
		}
		startRow, endRow := i*band, min((i+1)*band, a.rows)
		y0, y1 := startRow*frame.h/a.rows, endRow*frame.h/a.rows
		offset, end := y0*frame.w*3, y1*frame.w*3
		t.nextID++
		id := t.nextID
		fmt.Fprintf(&out, "%s[%d;%dH", esc, startRow+1, a.left)
		payload := base64.StdEncoding.EncodeToString(t.encode(frame.w, y1-y0, frame.data[offset:end]))
		q := 2
		if i == last {
			q, ackID = 0, id
		}
		for offset := 0; offset < len(payload); offset += 4096 {
			end := min(offset+4096, len(payload))
			more := 0
			if end < len(payload) {
				more = 1
			}
			if offset == 0 {
				fmt.Fprintf(&out, "%s_Ga=T,t=d,f=100,i=%d,c=%d,r=%d,C=1,q=%d,m=%d;",
					esc, id, a.cols, endRow-startRow, q, more)
			} else {
				fmt.Fprintf(&out, "%s_Gm=%d;", esc, more)
			}
			out.WriteString(payload[offset:end])
			out.WriteString(esc + `\`)
		}
		if old := t.ids[i]; old != 0 {
			erase(&out, old)
		}
		t.ids[i] = id
	}
	t.previous = frame
	return out.String(), ackID
}
