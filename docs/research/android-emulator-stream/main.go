package main

import (
	"bufio"
	"compress/zlib"
	"context"
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"os/exec"
	"os/signal"
	"regexp"
	"strconv"
	"strings"
	"sync/atomic"
	"syscall"
	"time"
)

const esc = "\x1b"

var mouse = regexp.MustCompile(`^\x1b\[<(\d+);(\d+);(\d+)([Mm])`)
var control = regexp.MustCompile(`^\x1b(?:\[[0-?]*[ -/]*[@-~]|O.)`)
var keys = map[string]int{
	"\x02": 4, "\x07": 3, "\x12": 187, "\r": 66, "\n": 66, "\t": 61,
	"\x7f": 67, "\x1bOP": 4, "\x1bOQ": 3, "\x1bOR": 187,
	"\x1b[A": 19, "\x1b[B": 20, "\x1b[C": 22, "\x1b[D": 21,
}

type area struct {
	left, cols, rows, width, height, footer int
}

type point struct{ x, y int }

func (a area) android(col, row int) point {
	return point{
		min(a.width-1, max(0, (2*(col-a.left)+1)*a.width/(2*a.cols))),
		min(a.height-1, max(0, (2*row-1)*a.height/(2*a.rows))),
	}
}

func android(ctx context.Context, serial string, args ...string) *exec.Cmd {
	return exec.CommandContext(ctx, "adb", append([]string{"-s", serial}, args...)...)
}

func stty(args ...string) ([]byte, error) {
	cmd := exec.Command("stty", args...)
	cmd.Stdin = os.Stdin
	return cmd.Output()
}

func terminalSize() (int, int) {
	out, _ := stty("size")
	var rows, cols int
	fmt.Sscan(string(out), &rows, &cols)
	if rows < 4 || cols < 24 {
		return 40, 80
	}
	return rows, cols
}

type inputState struct {
	press *point
	down  time.Time
}

func handleMouse(s *inputState, a *area, match []string, send func(string)) {
	if a == nil {
		return
	}
	button, _ := strconv.Atoi(match[1])
	col, _ := strconv.Atoi(match[2])
	row, _ := strconv.Atoi(match[3])
	inImage := col >= a.left && col < a.left+a.cols && row >= 1 && row <= a.rows
	if button&64 != 0 && inImage {
		p := a.android(col, row)
		delta := 3
		if button&1 != 0 {
			delta = -3
		}
		send(fmt.Sprintf("input mouse scroll %d %d --axis VSCROLL,%d", p.x, p.y, delta))
		return
	}
	if button&32 != 0 || button&3 != 0 {
		return
	}
	if match[4] == "M" {
		s.press = nil
		if inImage {
			p := a.android(col, row)
			s.press, s.down = &p, time.Now()
		}
		return
	}
	if s.press == nil {
		if row == a.footer && col >= 1 && col <= 25 {
			code := 4
			if col > 16 {
				code = 187
			} else if col > 8 {
				code = 3
			}
			send(fmt.Sprintf("input keyevent %d", code))
		}
		return
	}
	start := *s.press
	s.press = nil
	end := a.android(col, row)
	elapsed := time.Since(s.down).Milliseconds()
	if start == end && elapsed < 500 {
		send(fmt.Sprintf("input tap %d %d", start.x, start.y))
	} else {
		send(fmt.Sprintf("input swipe %d %d %d %d %d", start.x, start.y, end.x, end.y, min(1000, max(100, elapsed))))
	}
}

func input(cancel context.CancelFunc, layout *atomic.Pointer[area], acks chan<- int, send func(string)) {
	var state inputState
	var pending string
	var buf [1024]byte
	for {
		n, err := os.Stdin.Read(buf[:])
		if err != nil {
			cancel()
			return
		}
		pending += string(buf[:n])
		if len(pending) > 8192 {
			pending = ""
		}
		for len(pending) > 0 {
			if match := mouse.FindStringSubmatch(pending); match != nil {
				handleMouse(&state, layout.Load(), match, send)
				pending = pending[len(match[0]):]
				continue
			}
			if strings.HasPrefix(pending, esc+"_G") {
				end := strings.Index(pending, esc+`\`)
				if end < 0 {
					break
				}
				var id int
				if _, err := fmt.Sscanf(pending[3:end], "i=%d", &id); err == nil && strings.HasSuffix(pending[:end], ";OK") {
					select {
					case acks <- id:
					default:
					}
				}
				pending = pending[end+2:]
				continue
			}
			if pending[0] == 3 {
				cancel()
				return
			}
			sequence := pending[:1]
			if pending[0] == 27 {
				sequence = control.FindString(pending)
				if sequence == "" {
					if len(pending) < 2 || pending[1] == '[' || pending[1] == '_' || pending[1] == 'O' {
						break
					}
					pending = pending[2:]
					continue
				}
			}
			if code, ok := keys[sequence]; ok {
				send(fmt.Sprintf("input keyevent %d", code))
			} else if sequence[0] >= 32 && sequence[0] < 127 {
				n := 0
				for n < len(pending) && pending[n] >= 32 && pending[n] < 127 {
					n++
				}
				sequence = pending[:n]
				text := strings.ReplaceAll(strings.ReplaceAll(sequence, " ", "%s"), "'", "'\\''")
				send("input text '" + text + "'")
			}
			pending = pending[len(sequence):]
		}
	}
}

func run() error {
	width := flag.Int("width", 540, "portrait video width in pixels")
	fixture := flag.String("test", "", "path to a raw H.264 test clip; disables Android input")
	serial := flag.String("serial", "emulator-5554", "ADB device serial")
	cuda := flag.Bool("cuda", false, "use Linux NVIDIA hardware decoding and scaling")
	deviceW := flag.Int("device-width", 1080, "Android display width in portrait")
	deviceH := flag.Int("device-height", 2400, "Android display height in portrait")
	limit := flag.Int("seconds", 180, "Android capture duration in seconds (1–180)")
	flag.Parse()
	if *width < 160 || *width > 1080 || *width%2 != 0 {
		return errors.New("width must be even and between 160 and 1080")
	}
	if *deviceW < 1 || *deviceH < *deviceW || *limit < 1 || *limit > 180 {
		return errors.New("invalid portrait dimensions or capture duration")
	}
	test := *fixture != ""
	saved, err := stty("-g")
	if err != nil {
		return fmt.Errorf("run in a Rex terminal: %w", err)
	}
	if _, err := stty("raw", "-echo"); err != nil {
		return err
	}
	var report func()
	defer func() {
		if report != nil {
			report()
		}
	}()
	defer stty(strings.TrimSpace(string(saved)))
	fmt.Print(esc + "[?1049h" + esc + "[?25l" + esc + "[?1002h" + esc + "[?1006h")
	defer fmt.Print(esc + "_Ga=d,d=A,q=2" + esc + "\\" + esc + "[?1006l" + esc + "[?1002l" + esc + "[?25h" + esc + "[?1049l")
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM, syscall.SIGHUP)
	defer cancel()
	source := android(ctx, *serial, "shell", "-T", "screenrecord", "--output-format=h264",
		"--bit-rate=24M", fmt.Sprintf("--time-limit=%d", *limit), "-")
	if test {
		source = exec.CommandContext(ctx, "cat", "--", *fixture)
	}
	source.Stderr = os.Stderr
	h264, err := source.StdoutPipe()
	if err != nil {
		return err
	}
	args := []string{"-nostdin", "-hide_banner", "-loglevel", "error"}
	if test {
		args = append(args, "-re")
	}
	scale := fmt.Sprintf("scale=w='if(gte(iw,ih),-2,%d)':h='if(gte(iw,ih),%d,-2)':flags=fast_bilinear", *width, *width)
	if *cuda {
		args = append(args, "-hwaccel", "cuda", "-hwaccel_output_format", "cuda")
		scale = fmt.Sprintf("scale_cuda=w='if(gte(iw,ih),-2,%d)':h='if(gte(iw,ih),%d,-2)':format=nv12,hwdownload,format=nv12", *width, *width)
	}
	args = append(args,
		"-flags", "low_delay", "-probesize", "32768", "-analyzeduration", "100000", "-f", "h264",
		"-threads", "1", "-i", "pipe:0", "-an",
		"-vf", scale,
		"-fps_mode", "passthrough", "-pix_fmt", "rgb24", "-threads", "1", "-c:v", "ppm", "-f", "image2pipe", "pipe:1")
	decoder := exec.CommandContext(ctx, "ffmpeg", args...)
	decoder.Stdin, decoder.Stderr = h264, os.Stderr
	png, err := decoder.StdoutPipe()
	if err != nil {
		return err
	}
	if err := source.Start(); err != nil {
		return err
	}
	defer func() { cancel(); h264.Close(); source.Wait() }()
	if err := decoder.Start(); err != nil {
		return err
	}
	defer func() { cancel(); png.Close(); decoder.Wait() }()
	var send = func(string) {}
	if !test {
		controls := android(ctx, *serial, "shell", "-T", "sh")
		writer, err := controls.StdinPipe()
		if err != nil {
			return err
		}
		controls.Stderr = os.Stderr
		if err := controls.Start(); err != nil {
			return err
		}
		defer func() { cancel(); writer.Close(); controls.Wait() }()
		commands := make(chan string, 16)
		send = func(command string) {
			select {
			case commands <- command:
			default:
			}
		}
		go func() {
			for {
				select {
				case <-ctx.Done():
					return
				case command := <-commands:
					if _, err := fmt.Fprintln(writer, command); err != nil {
						cancel()
						return
					}
				}
			}
		}()
	}
	var layout atomic.Pointer[area]
	acks := make(chan int, 4)
	go input(cancel, &layout, acks, send)
	frames := make(chan rgbFrame, 1)
	failed := make(chan error, 1)
	var decoded atomic.Uint64
	go func() {
		defer close(frames)
		reader := bufio.NewReaderSize(png, 64*1024)
		for {
			frame, err := readRGB(reader)
			if err != nil {
				failed <- err
				return
			}
			decoded.Add(1)
			select {
			case <-frames:
			default:
			}
			frames <- frame
		}
	}()
	lines, columns := terminalSize()
	nextSize := time.Now().Add(time.Second)
	compressor, err := zlib.NewWriterLevel(io.Discard, zlib.BestSpeed)
	if err != nil {
		return err
	}
	render := tiles{z: compressor, nextID: 40}
	var received, count, sentFPS, inputFPS, missed, consecutiveTimeouts int
	var previousDecode uint64
	var ackElapsed, totalAck time.Duration
	var payloadBytes int
	started := time.Now()
	since := started
	if test {
		report = func() {
			average := time.Duration(0)
			if received > 0 {
				average = totalAck / time.Duration(received)
			}
			fmt.Fprintf(os.Stderr, "\r\nTest: %d decoded, %d Rex-acknowledged, %d timeouts in %.2fs, mean ack %d ms, %.1f MB terminal data\r\n",
				decoded.Load(), received, missed, time.Since(started).Seconds(), average.Milliseconds(), float64(payloadBytes)/1e6)
		}
	}
	for frame := range frames {
		if ctx.Err() != nil {
			return nil
		}
		now := time.Now()
		if now.After(nextSize) {
			lines, columns = terminalSize()
			nextSize = now.Add(time.Second)
		}
		w, h := frame.w, frame.h
		rows := max(1, min(lines-2, h, columns*h/(w*2)))
		cols := max(1, min(columns, (rows*w*2+h/2)/h))
		a := area{left: (columns-cols)/2 + 1, cols: cols, rows: rows, width: *deviceW, height: *deviceH, footer: lines - 1}
		if w > h {
			a.width, a.height = a.height, a.width
		}
		old := layout.Load()
		resized := old == nil || *old != a || render.previous.w != w || render.previous.h != h
		update, ackID := render.update(frame, a, resized)
		refreshStatus := now.Sub(since) >= time.Second
		if refreshStatus {
			seconds := now.Sub(since).Seconds()
			currentDecode := decoded.Load()
			inputFPS = int(float64(currentDecode-previousDecode)/seconds + 0.5)
			previousDecode = currentDecode
			sentFPS = int(float64(count)/seconds + 0.5)
			count, since = 0, now
		}
		if ackID == 0 && !refreshStatus {
			continue
		}
		status := fmt.Sprintf("%dx%d | decoded %d fps | Rex ack %d/s | last ack %d ms | timeouts %d | Ctrl-C exits",
			w, h, inputFPS, sentFPS, ackElapsed.Milliseconds(), missed)
		start := time.Now()
		if _, err := io.WriteString(os.Stdout, update); err != nil {
			return err
		}
		payloadBytes += len(update)
		if _, err := fmt.Fprintf(os.Stdout, "%s[%d;1H%s[2K[Back]  [Home]  [Recents]%s[%d;1H%s[2K%s",
			esc, a.footer, esc, esc, a.footer+1, esc, status[:min(len(status), columns-1)]); err != nil {
			return err
		}
		layout.Store(&a)
		if ackID == 0 {
			continue
		}
		timer := time.NewTimer(120 * time.Millisecond)
	ack:
		for {
			select {
			case id := <-acks:
				if id == ackID {
					received++
					count++
					ackElapsed = time.Since(start)
					totalAck += ackElapsed
					consecutiveTimeouts = 0
					break ack
				}
			case <-timer.C:
				missed++
				consecutiveTimeouts++
				if consecutiveTimeouts >= 5 {
					return errors.New("Rex stopped acknowledging the video")
				}
				break ack
			case <-ctx.Done():
				timer.Stop()
				return nil
			}
		}
		timer.Stop()
	}
	err = <-failed
	if ctx.Err() == nil && (!errors.Is(err, io.EOF) || received == 0 || (!test && time.Since(started) < time.Duration(*limit-1)*time.Second)) {
		return fmt.Errorf("video stream stopped: %w", err)
	}
	return nil
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
