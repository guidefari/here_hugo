---
title: "AWS Cloudwatch"
date: 2023-01-06T10:14:10+02:00
description: Logs, Metrics, Alarms, Events, & Dashboards
tags: [aws, cloudwatch]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=AWS%20Cloudwatch']
---
Cloudwatch collects & manages operational data. It's a public service, meaning it can be used outside of the AWS ecosystem.
Cloudwatch operates by default when you provision some AWS resources.

- Cloudwatch agent - this could be interesting to look into
  - Allows you to get detailed metrics on: memory utilization, disk swap, disk space, and more

## More than one service

Cloudwatch is one name used for:

1. Cloudwatch logs
2. Cloudwatch Metrics
3. Cloudwatch Events - Trigger an event based on a condition, or on a schedule. eg if an EC2 instance is terminated, that would generate an event that can be used to trigger something else
4. Cloudwatch Alarms - Triggers notifications based on metrics in breach of a defined threshold
5. Cloudwatch Dashboards - create custom dashboards from cloudwatch metrics

On a related note, check out [Cloudtrail]({{<ref cloudtrail>}})

# 1. Cloudwatch logs

- This is the core service, that all the other cloudwatch services rely on.
- Logs belong in a log group, they cannon exist outside of one
- Logs are kept indefinitely by default, they don't expire

# 2. Cloudwatch Metrics

- Represents a time ordered set of data points
- Comes with many pre-defined metrics
- Custom metrics are a thing
- With **High resolution metrics** (only available with custom metrics) you can track at 1sec, 5sec, 10sec, 30sec, multiples of 60sec
- Metrics - CPU, memory, disk utilization (list isn't exhaustive ofc.)

---

## Log vs Metric

- A log is an event that happened and a metric is a measurement of the health of a system.
