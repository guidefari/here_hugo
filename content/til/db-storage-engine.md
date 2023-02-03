---
title: "TIL: MySQL Storage Engines"
date: 2023-02-03T09:51:53+02:00
description: bits about MySQL architecture
tags: [til, aws, db, architecture]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=TIL%3A%20MySQL%20Storage%20Engines']
---

While studying [AWS RDS](https://aws.amazon.com/rds/), I read that automated backups are only supported for the **InnoDB storage engine**.

That's when I decided to look up MySQL storage engines, which are basically the part of the database server that deals with how/where on the harddrive the data is stored.

## Few examples of storage engines

- InnoDB
- MyISAM
- Memory
- CSV
- NDB Cluster

# Sources

- [Understanding MYSQL Logical Architecture](https://medium.com/coderbyte/understanding-mysql-logical-architecture-526eaf72f66e)
- [Architecture of MySQL](https://www.geeksforgeeks.org/architecture-of-mysql/)
