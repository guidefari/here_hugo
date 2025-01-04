---
title: "Book Notes: Accelerate"
date: 2021-12-28T16:27:39+02:00
description: "highlights, quotes, & other interesting bits from Accelerate"
tags: [book, notes, devops, leadership, process, systems theory]
---

- [Get the book here](https://www.goodreads.com/book/show/35747076-accelerate)

- [difference between organisations taking on a maturity model vs a capabilities model](/maturity-vs-capability)

## culture & devops

this book highlighted to me, the importance of culture in order for an organisation's devops efforts to succeed.

culture can be a bit of a buzzword, and is inherently a subjective term, but it is 'quantified' well in the book.

## Management

- [Change advisory boards](/on-change-advisory-boards)

## Related

- [Book notes](https://www.softwaremeadows.com/devops/accelerate_notes_and_quotes/) by Charles Flatt

## Summarised by [Gijs Meijer & Marcin Pakulnicki]({{<ref ing-bank>}})

---

3 things you want to iterate & improve on, for more effective software delivery:
1. Flow
2. Feedback
3. Culture

### Flow

- fast from dev to prod
- trunk based dev
- ci
- immutable, containerized build - enables fast rollback, and maybe other benefits, that I’m not yet aware of

### Feedback (everything after you’ve deployed the code)

- fully automated testing
- monitoring, alerting, logging
- code scan, OWASP check
- shift left of risk

### Culture 

- eng culture
- learning organization (Google 20% mastery time)
- post mortems

# How do the authors define, quantify, and measure culture?

---

# on Developer Velocity
Borrowing from Will Larson's summary in [Elegant Puzzle](/elegant-puzzle), velocity is measured by:

1. Delivery Lead time - time from creation of code, to its use in production
2. Deployment frequency
3. Change fail rate
4. [Time to restore service](/mttr)
