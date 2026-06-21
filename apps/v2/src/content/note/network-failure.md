---
title: "Handling Network Failure on your Frontends"
date: 2023-09-08T07:07:25+02:00
description: Network failures are an inevitability in distributed computing. Your frontend has to be built with that in mind
tags: [ux, design, frontend]
images:
  [
    "https://images-here-hugo.vercel.app/api/og-image?title=Handling+Network+Failure",
  ]
---

## UX concerns around feedback

- not all network requests are of the same importance. Not all failed requests need to communicate a message to the user
  - is this a critical user flow? Is the network request blocking the user journey that the customer is on? If so, give user feedback, such as toastie/popup messages
  - On the same feedback component, give an option for the user to manually retry, or some indication of next step(s) they can take to alleviate the error
- It’s not a good idea to [throw](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) a process breaking error on a failed network request

## Implementation patterns to follow

- automatic retry logic
  - exponential backoff
  - regular intervals, with a set number of retries
  - this can be done in the background, I’d consider these as graceful network failures
- UI to allow manual retry
- Sentry & other obs tools
- Return the actual error object, and let the consumer decide on how to handle stuff

---

### Excerpts from [Spotify Teardown](/spotify-teardown)

> Even if Spotify appeared to be running smoothly, hundreds of minor malfunctions were taking place in its network transmissions. For instance, during the premium session, the Spotify client made 213 attempts to establish contact with an IP address located in San Francisco, without any success.

> The point is that network protocol analysis tools enable considerations of how “technology cannot exist without failure.
