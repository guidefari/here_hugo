---
title: "Some Patterns of Multi-Tenant SaaS"
date: 2023-04-29T23:05:50+02:00
description: I've had the pleasure of working on some multi-tenant products, and noticed some concerns repeat themselves. This note tries to capture some of those
tags: [architecture]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Multi-Tenant%20SaaS']
---
## Disclaimer
- There's no one blueprint for SaaS architecture. Sure there's patterns, but those are just tools for thinking.

# Management
- Metrics - capturing tenant context in metrics tends to be useful
- Analytics
- Billing
- Provisioning
- Compliance - SOC 2, HIPAA, GDPR etc. Depending on the countries and industries you serve, you have to be aware of any compliance requirements.
- PII

# Application
- Isolation - Compute, memory. This is when you start to think about the Noise neighbor & performance requirements. 
- Storage Partitioning
- Deployment
- Routing
- UI whitelabelling (doing an E2E PoC on this would be cool)
- When designed well, you shouldn't have to think about multi-tenancy a whole lot when writing application code. This is preferred, as it greatly reduces [Extraneous Cognitive Load](/clt)
- Logging - similar to metrics, it's important to capture tenant context here

# Tenancy
- Identity
- Onboarding: preferably automated. Whether it's B2C (customer onboards themselves onto the platform), or B2B (internal team onboards customers), it's good to have this process as frictionless as possible.
- Tiering

# Silos vs Pools
Resource isolation is an important topic

- Silo is a fully isolated environment, services being run and hosted for one tenant only
- Pool is the other side of this, shared resources
- The choice of silo or pool can be done on a case by case basis
- Isolation can be achieved via siloed infrastracture, or through runtime policies 

# Reading list
{{<youtube j7Sqt8GpYl0>}}
{{<youtube joz0DoSQDNw>}}
- [ ] [Approaches to implementing multi-tenancy in SaaS applications](https://developers.redhat.com/articles/2022/05/09/approaches-implementing-multi-tenancy-saas-applications#)
- [ ] [Multi-Tenancy Trends in SaaS Applications](https://frontegg.com/blog/multi-tenancy-trends-in-saas-applications)
- [ ] [Multi tenant Architecture for a SaaS Application on AWS](https://www.clickittech.com/saas/multi-tenant-architecture/)
- [ ] [Evolving the App to Multi Tenant](https://www.newline.co/courses/fullstack-svelte/multi-tenant-app)
- [ ] [DDG search](https://duckduckgo.com/?q=white+labelling+for+multi+tenant+web+apps&t=iphone&ia=web)
- [ ] [Architectural approaches for compute in multitenant solutions](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/compute)
- [this youtube playlist of mine](https://youtube.com/playlist?list=PLy64tqMRKcJT2s0A_yiCwHvPTDC2Qo_BR) has a bunch of reference resources for multi-tenant-architecture
