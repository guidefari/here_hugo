package main

import (
	"bufio"
	"bytes"
	"compress/zlib"
	"image/png"
	"io"
	"strings"
	"testing"
)

func TestTileUpdates(t *testing.T) {
	encoder, err := zlib.NewWriterLevel(io.Discard, zlib.BestSpeed)
	if err != nil {
		t.Fatal(err)
	}
	renderer := tiles{z: encoder, nextID: 40}
	initial := rgbFrame{w: 2, h: 16, data: make([]byte, 2*16*3)}
	a := area{left: 2, cols: 2, rows: 16}
	out, ack := renderer.update(initial, a, true)
	if strings.Count(out, "a=T,") != 2 || ack != 42 {
		t.Fatalf("first update: graphics commands %d, ack ID %d", strings.Count(out, "a=T,"), ack)
	}
	if out, ack := renderer.update(initial, a, false); out != "" || ack != 0 {
		t.Fatal("identical frame emitted an update")
	}
	changed := rgbFrame{w: initial.w, h: initial.h, data: bytes.Clone(initial.data)}
	changed.data[8*2*3] = 231
	out, ack = renderer.update(changed, a, false)
	if strings.Count(out, "a=T,") != 1 || ack != 43 || !strings.Contains(out, "d=I,i=42,") {
		t.Fatal("one changed band should replace only its own image")
	}
	image, err := png.Decode(bytes.NewReader(renderer.png.Bytes()))
	if err != nil {
		t.Fatal(err)
	}
	r, g, b, _ := image.At(0, 0).RGBA()
	if image.Bounds().Dy() != 8 || r != 231*257 || g != 0 || b != 0 {
		t.Fatalf("unexpected changed pixel: %d %d %d", r, g, b)
	}
}

func TestReadRGB(t *testing.T) {
	frame, err := readRGB(bufio.NewReader(strings.NewReader("P6\n2 1\n255\n\x01\x02\x03\x04\x05\x06")))
	if err != nil || frame.w != 2 || frame.h != 1 || !bytes.Equal(frame.data, []byte{1, 2, 3, 4, 5, 6}) {
		t.Fatalf("unexpected frame: %+v, %v", frame, err)
	}
}
