---
title: "Some Patterns of Multi-Tenant SaaS"
date: 2023-04-29T23:05:50+02:00
description: 
tags: [architecture]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=']
draft: true
---
I've had the pleasure of working on some multi-tenant products, and noticed some concerns repeat themselves.

## Disclaimer
- There's no one blueprint for SaaS architecture. Sure there's patterns, but those are just tools for thinking.

# Management
- Metrics
- Analytics
- Billing
- Provisioning
- Compliance - SOC 2, HIPAA, GDPR etc. Depending on the countries and industries you serve, you have to be aware of any compliance requirements.
- PII

# Application
- Isolation
- Partitioning
- Deployment
- Routing
- UI whitelabelling (doing an E2E PoC on this would be cool)

# Tenancy
- Identity
- Onboarding (preferably automated)
- Tiering

# Silos vs Pools
- Silo is a fully isolated environment, services being run and hosted for one tenant only
- Pool is the other side of this, shared resources

# Reading list
{{<youtube j7Sqt8GpYl0>}}
- [ ] [Approaches to implementing multi-tenancy in SaaS applications](https://developers.redhat.com/articles/2022/05/09/approaches-implementing-multi-tenancy-saas-applications#)
- [ ] [Multi-Tenancy Trends in SaaS Applications](https://frontegg.com/blog/multi-tenancy-trends-in-saas-applications)
- [ ] [Multi tenant Architecture for a SaaS Application on AWS](https://www.clickittech.com/saas/multi-tenant-architecture/)
- [ ] [Evolving the App to Multi Tenant](https://www.newline.co/courses/fullstack-svelte/multi-tenant-app)
- [ ] [DDG search](https://duckduckgo.com/?q=white+labelling+for+multi+tenant+web+apps&t=iphone&ia=web)
- [ ] [Architectural approaches for compute in multitenant solutions](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/compute)