---
title: "JavaScript’s using keyword"
date: 2026-10-08
description: "Scope-bound resource cleanup in JavaScript, and the connection to C# using that I first learnt at littlefish."
tags: [javascript, learning, resource]
images: ['https://og.guidefari.com/og-image?title=JavaScript%E2%80%99s%20using%20keyword']
---

I first learnt about `using` during my C# days at littlefish. Seeing it in JavaScript brings back the same idea: acquire a resource, use it, and make sure cleanup happens when its scope ends.

## Cleanup, not garbage collection

JavaScript calls this **Explicit Resource Management**. A `using` declaration creates a fixed binding, like `const`, and registers the object's `[Symbol.dispose]()` method for cleanup when execution leaves the containing scope. This happens on normal completion, `return`, or `throw`. Multiple resources are disposed in reverse declaration order. [TC39 describes the semantics](https://github.com/tc39/proposal-explicit-resource-management#semantics).

Garbage collection reclaims memory from unreachable objects on its own schedule. It doesn't give me a predictable moment to release a file handle, lock, or connection. `using` ties that cleanup to scope exit instead. It calls a method; it doesn't delete the JavaScript object or replace garbage collection.

## A small example

This is a custom disposable, not a built-in resource API:

<figure class="code-output" aria-label="JavaScript example and its output">
<div class="code-output-panes">
<div class="code-output-pane">
<p class="code-output-label">JavaScript</p>

```js
function resource(name) {
  console.log(`Opened ${name}`);
  return {
    [Symbol.dispose]() {
      console.log(`Closed ${name}`);
    }
  };
}

function work() {
  using first = resource("first");
  using second = resource("second");
  console.log("Working");
  return;
}

work();
```

</div>
<div class="code-output-pane">
<p class="code-output-label">Output</p>

```text
Opened first
Opened second
Working
Closed second
Closed first
```

</div>
</div>
</figure>

The early return still triggers cleanup. Throwing an error in place of `return` also disposes both resources before the error propagates.

For a single resource, the familiar `try/finally` equivalent is:

```js
const handle = resource("example");
try {
  console.log("Working");
} finally {
  handle[Symbol.dispose]();
}
```

That's the mental model, not a complete translation. If both the body and disposal throw, `using` preserves both errors through `SuppressedError`, and still attempts remaining cleanup. [TypeScript's 5.2 explanation](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management) walks through these cases.

## Async cleanup and the C# connection

`await using` calls `[Symbol.asyncDispose]()` and awaits cleanup at scope exit. It can fall back to `[Symbol.dispose]()` when the async method is absent. Use it where `await` is permitted, such as an async function. It doesn't automatically await resource acquisition: if acquisition returns a promise, I still need `await` in the initializer.

The C# parallel is [`IDisposable.Dispose()` and `IAsyncDisposable.DisposeAsync()`](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/using). JavaScript uses symbol-named methods instead of those interfaces. This is about C#'s resource-management statement or declaration, not its `using` directive for namespace imports.

## Why cleanup matters, and what else JavaScript offers

A forgotten connection can keep a pool slot occupied. A forgotten lock can block other work. A timer or event listener can keep running after the work that needed it has ended. These problems accumulate in long-running apps, even when garbage collection works correctly.

`using` reduces the chance of missing cleanup on an error or early return. It doesn't make the work itself faster or invent cleanup for me: the disposal method still has to release the resource correctly, and the scope must match how long I need it.

Other options serve different needs:

- **`try/finally` and explicit cleanup methods:** call the API's `close()`, `release()`, `clearInterval()`, or `removeEventListener()` as appropriate. `finally` keeps cleanup on the error path too, without requiring the disposal symbols.
- **[`DisposableStack` and `AsyncDisposableStack`](https://v8.dev/features/explicit-resource-management#disposablestack-and-asyncdisposablestack):** group resources and cleanup callbacks, then run them in reverse order. `defer()` registers a callback; `adopt()` pairs a value with its cleanup. They work with `using` and `await using`, including for APIs that don't implement the disposal protocol themselves.
- **[`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController):** cancel operations that accept its signal, such as `fetch`. Cancellation is related to cleanup, but isn't a general replacement for closing or releasing resources.
- **[`FinalizationRegistry`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry):** register callbacks that may run after garbage collection. Their timing isn't predictable, and they may never run. Don't rely on them for essential cleanup.

## Can I use it now?

Checked on 8 October 2026: [TC39's finished-proposals list](https://github.com/tc39/proposals/blob/main/finished-proposals.md) lists Explicit Resource Management as Stage 4, with expected publication in **2027**. The proposal README still says Stage 3, so I wouldn't use that older label as the current status.

Native support is not universal. [Node.js 24.0.0's release notes](https://nodejs.org/en/blog/release/v24.0.0) explicitly list resource management and the commit enabling it. [V8's feature documentation](https://v8.dev/features/explicit-resource-management#availability) reports Chromium 134 support, but its Node support summary is outdated compared with Node's release notes.

TypeScript 5.2 added compiler support earlier. Compilation can lower the syntax, but older targets may still need disposal symbols or other runtime polyfills. Before adopting it, check the actual runtime and whether the resource implements the disposal protocol.
