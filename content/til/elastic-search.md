---
title: "TIL: Elastic Search"
date: 2024-12-21T22:02:42+02:00
description: Learnt a bit more about Elastic Search. Architecture overview, how to use it, and situations where you'd consider using it. 
tags: [til, backend]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Elastic+Search']
---

Learnt a bit more about Elastic Search. Architecture overview, how to use it, and situations where you'd consider using it.

## Source
{{<youtube PuZvF2EyfBM>}}

## Architecture
An Elastic search cluster has the following nodes:

1. Coordinating node
2. Master node
3. Data node
4. Ingest node
5. Machine learning node

- Elastic search provides a distribution system on top of [Lucene](https://github.com/apache/lucene).
  - Replication, shards, indexes, providing the http interface, coordinating the distributed queries

## A few examples of where it works well
- Read heavy workloads: My understanding so far tells me that this kind of situation is where Elastic Search works best
- Fuzzy matching
- Supporting faceted-search, especially which is common on e-commerce sites.
- Full text, geo-spatial, and structured search

## How it keeps in sync with your DB
There are a few ways to achieve this.

- Change Data Capture tools like Debezium
- Dual writes: More complex application code, but less infrastructure overhead. Risk of inconsistencies here though, I wouldn't try this on a greenfield project.
- Batch sync & cron jobs: usable when you don't need real time sync.
- Message queues or event streaming

## Not a database
- It's optimised for search, not efficient storage
- Durability & availability aren't as bulletproof as a traditional db
- No ACID transactions

You get the point, the list goes on.

## Misc
- Denormalization is key with elastic search. You shouldn't need to do complex joins or nested queries when using it.