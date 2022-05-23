---
title: "TIL: Websockets basics"
date: 2022-05-23T21:10:59+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, react, websockets]
---
# Websockets

- URL protocol used isn’t `http` or `https`, it is instead `ws://` or `wss://`
- `wss://` is websockets over TLS, same way `https` is.
- With http, the comms are one way in that server can only respond to an HTTP req initiated by the client, whereas with websockets, the server can also initiate comms

> In a WebSocket request, a client requests that once HTTP connection is established, the server should *Upgrade*
 to WebSocket connection, as defined in the *Connection*
 header
>
> [src](https://javascript.plainenglish.io/websocket-an-in-depth-beginners-guide-96f617c4c7a5) 

### Basic ws request example

```jsx
GET ws://websocket.example.com/ HTTP/1.1
Origin: http://example.com
Connection: Upgrade
Host: websocket.example.com
Upgrade: websocket
```

- The header `Sec-WebSocket-Protocol` allows you to specify the sub-protocol that your web-socket connection intends on using. describes the data formats you’ll be using.
    - soap
    - wamp
    - mqtt

### Frames

`ws` communication happens using frames, and there are many different kinds of frames.

- Text frames
- binary data frames
- ping/pong frames - which check whether a connection is still alive

> WebSocket `.send()` method can send either text or binary data.

## Sources

- [WebSocket: An In-Depth Beginner’s Guide](https://javascript.plainenglish.io/websocket-an-in-depth-beginners-guide-96f617c4c7a5)
- [Javascript.info](https://javascript.info/websocket)

# useState

- If it’s derived state, try to [avoid useState all together](https://tkdodo.eu/blog/dont-over-use-state)

> The initial value of a useState hook is always discarded on re-renders - it only has an effect when the component mounts.
**[src](https://tkdodo.eu/blog/putting-props-to-use-state)**

*useState reading to be continued tomorrow if I get the time*