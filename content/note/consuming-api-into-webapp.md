---
date: "2021-04-25"
tags: [typescript, notes, api]
title: "Consuming an API in your web app"
description: "Some notes on a pattern I've seen when writing code that relies on data from an API"
---

I've broken the pattern down into 5 major pieces:

## 1. `async` function that `awaits` a `response` from the server.
   ```ts
router.get('/alltracks', async (req: Request, res:Response) => {
    const alltracks = await Track.find({})
})
   ```
   
## 2. checking the `response status` 
status codes can affect flow of the program in many different ways, depending on the use case.
```ts
const checkedResponse: Response = await checkResponseStatus(response);
```

## 3. retrieve the `json` content from the `response`
assuming what you're receiving is json.
```ts
let tracks: unknown = await getJsonContent(checkedResponse);
```

## 4. `return` nicely formatted data
as per the needs of your app
```ts
let retVal: Track[] = tracks.map(track =>
    new Track( 
        track.name, 
        track.id, 
        track.artists, 
        track.streamURL, 
        track.thumbnailURL, 
        track.genres 
    )
```

## 5. optional? validate data before returning it.
I wonder what options I have to achieve this at runtime, I've seen use of [io-ts](https://github.com/gcanti/io-ts) so far. again, what you use at this stage is a contextual solution.


These are to serve as a general guideline, things to think about, when consuming external data into your application.

