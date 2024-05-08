---
title: "TIL: Testable Examples in Go"
date: 2024-05-07T07:49:50+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, go, testing]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Testable+Examples']
---

- Seen while going through [Go with tests](https://quii.gitbook.io/learn-go-with-tests/go-fundamentals/integers).

- If you add a function in your test file that starts with the name `Example`, the test suite will run it.
```go
func ExampleAdd() {
	sum := Add(1, 5)
	fmt.Println(sum)
	// Output: 6
}
```
- Expected output, or value to assert against, is that last line, `// Output: 6`
- Docs on [Testable Examples](https://blog.golang.org/examples)
- Apparently all this plays well with [godoc](https://github.com/golang/tools/tree/master/godoc), which I'm yet to get working.
