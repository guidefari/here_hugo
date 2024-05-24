---
title: "TIL: Value & Pointer Receivers in Go"
date: 2024-05-20T06:45:01+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, go]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Go+Receiver']
---

> [Receivers allow you to associate a method with a type, and they come in two flavors: **value receivers** and **pointer receivers**. - Sidharthan Chandrasekaran Kamaraj](https://thebugshots.dev/understanding-value-and-pointer-receivers-in-golang)

Here is an example of a simple type with a method that has a receiver:

```go
package main

import "fmt"

type Message struct {
    Content string
}

// value receiver
func (m Message) Display() {
    fmt.Println(m.Content)
}

func main() {
    msg := Message{"Hello, World!"}
    msg.Display() // Calling the method on the Message instance
}
```

In this example, the `Display` method is associated with the `Message` type by having a receiver of type `Message`. This allows us to call the `Display` method on a `Message` instance, like `msg.Display()`.

## Value vs Pointer receiver
- A value receiver will run its operations on a copy of the instance
- While a pointer will operate on the actual instance associated

## Read more
- [Understanding value & pointer receivers in golang](https://thebugshots.dev/understanding-value-and-pointer-receivers-in-golang).
- [A tour of Go - Pointer Receivers](https://go.dev/tour/methods/4)