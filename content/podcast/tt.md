---
title: "Typescript & testing"
date: 2023-03-21T17:47:08+02:00
description: 
tags: [podcast, typescript, testing]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=']
---


{{<spotify episode 34nr9urOtrwVpGOJbNrNMq>}}

- He got tired of facing the same type of problem over and over again, on the frontend it’s like when you split a component into a bunch of different ones, then you forget some edge case or whatever, and you pass the wrong props to a component. That same type of problem would happen over and over again
- And same for the API side, the dynamically typed languages were just bringing the same type of error, that a statically typed language could eliminate.
- Getting rid of day to day problems he got tired of fighting
- Problem with dynamically typed languages: the unexpected null. It’s even easy to miss for this when writing tests
- Their frontend isn’t really unit tested. Components aren’t tested one by one. There’s cypress run which is like one big smoke test to go through the app, just making sure nothing breaks. But there’s no testing of “if I pass this to the component, this will render”
- io-ts to do runtime type checks before backend calls are made.
- Makes for much easier refactoring. As the code editor is showing you step by step which areas may need to change.
- [https://www.executeprogram.com/blog/are-tests-necessary-in-typescript](https://www.executeprogram.com/blog/are-tests-necessary-in-typescript)

# On Refactoring

This is a comment I saw in some documentation at work:
> A strong test suite guarantees the expected behaviour of a system while enabling fearless refactoring. T.Stelzer

I agree with this statement, and believe strong types contribute in a similar fashion

# Types express intent
