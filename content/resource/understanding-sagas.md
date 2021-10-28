---
title: "Understanding Sagas"
date: 2021-10-28T10:41:02+02:00
description: this term has been referred to enough times around me, for me to want to understand what it means.
tags: [frontend, backend, architecture, microservices]
---

* my first encounter with `sagas` was via `Redux`. [this](https://hackernoon.com/redux-saga-tutorial-for-beginners-and-dog-lovers-aa69a17db645) tutorial was a lovely intro. But when the term `Sagas` started being used as a way to think of how the architecture of a new ecosystem of products would be structured/built, I knew I had to dive deeper into finding out what a saga is really.
* was good to get exposed to the thinking of `choreography` vs `orchestration`

* links & videos will be on Redux sagas, & sagas as an architecture pattern for microservices & managing distributed transactions.

* **def:** a transaction is a set of operations that is 'all or nothing' - meaning either all of the operations are executed/applied, or none of them are. explained better by [these SQL docs](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/transactions-transact-sql?view=sql-server-ver15).
  * I also linked to a video on `ACID transactions` - *intro to DBs refresher 😉*

---

### previous/related notes
- [sagas microservice architecure patterns]({{<ref sagas-microservice-architecture-patterns.md>}})
- [Martin Fowler: microservices]({{<ref martin-fowler.md>}})

---

# redux
{{<youtube _TwzWUUTPpk >}}

---

# architecture pattern
- [ ] [what is a saga pattern and how important is it?](https://medium.com/swlh/microservices-architecture-what-is-saga-pattern-and-how-important-is-it-55f56cfedd6b)
- [ ] [microservices.io](https://microservices.io/)

---
{{<youtube Z4Ug7NL2VAk >}}

---
{{<youtube YPbGW3Fnmbc >}}
* this one is highly recommended, probably the best resource I've found so far. by Chris Richardson
---
{{<youtube AcqtAEzuoj0 >}}
