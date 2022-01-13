---
title: "Security"
date: 2022-01-07T18:21:58+02:00
description: Some security stuffs
tags: [security]
tldr: Random bits of security related knowledge I want to keep together.
---


# definitions 
- OSINT : Open source intelligence gathering. practiced by lots of security personnel, at various stages of whatever security jobs they're working. 

- APT: Advanced Persistent Threat

- Botnet: the one i just heard about was taken down by bringing down the command & control servers. this was done by collaborating with the dns provider for the domain names that the command and control serve

- [Supply chain attack](https://securityintelligence.com/articles/supply-chain-attack-what-it-is-what-to-do/)

- SOC: [Security operations centre](https://www.mcafee.com/enterprise/en-us/security-awareness/operations/what-is-soc.html)

- CnC (Command & Control server): related to botnet,

-  [MSP (Managed Service Provider)](https://www.acronis.com/en-us/articles/msp/)
# youtube stuff
### Attackers with good operations security
{{<youtube zXmZnU2GdVk>}}
- botnet active between 2005 - 2015/16
- over 500 000 infected machines
- the black hat team had an interesting network topology set up, they wouldn't just connect to the internet. to reach the **command & control server**,each member of the team was given a pre-configured router & antenna, which they'd use to steal wifi from people within a 1.5 mile radius, proxy through at least 3 infected machines, & only then communicate with CnC. this is just one layer of their OpSec 🙌
- they also had an interesting & automated election process, to choose which infected machines were good enough to be used as proxies
- Attackers had a pretty good automation game, over the years they automated people out of jobs with the org, and in turn became more secure

**Verdict**: to sum it up, a really interesting video.
