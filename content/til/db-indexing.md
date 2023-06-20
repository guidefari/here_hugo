---
title: "Database Indexing"
date: 2023-06-15T09:00:33+02:00
description: Today I (re)learned Database Indexing
tags: [database, performance]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Database%20Indexing']
---

This came up in a recent interview, the topic of indexing a database.

While I know it's a concept that exists, I didn't have enough knowledge at hand to have a fluent conversation about the topic. This note is an attempt at correcting that, lol.

# What is DB indexing
Database indexing is a way to reduce lookup time of a database.

> [an index **maps search keys** to corresponding **data on disk** by using different in-memory & on-disk data structures.](https://www.freecodecamp.org/news/database-indexing-at-a-glance-bb50809d48bd/)


# When can I index?
- You have millions/billions of rows in your tables, & lookup time has become unusable
- You know your data access patterns


## Types of indexes
* b-tree
* b+tree
* BRIN
* GiST

# Related reading
{{<youtube Jemuod4wKWo>}}
{{<youtube NZgfYbAmge8>}}

- [Indexing in RavenDB Compared to MongoDB and PostgreSQL](https://ravendb.net/articles/indexing-in-ravendb-compared-to-mongodb-and-postgresql)
