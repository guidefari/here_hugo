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

- [deep packet inspection](https://digitalguardian.com/blog/what-deep-packet-inspection-how-it-works-use-cases-dpi-and-more)
# youtube stuff
### Attackers with good operations security
{{<youtube zXmZnU2GdVk>}}
- botnet active between 2005 - 2015/16
- over 500 000 infected machines
- the black hat team had an interesting network topology set up, they wouldn't just connect to the internet. to reach the **command & control server**,each member of the team was given a pre-configured router & antenna, which they'd use to steal wifi from people within a 1.5 mile radius, proxy through at least 3 infected machines, & only then communicate with CnC. this is just one layer of their OpSec 🙌
- they also had an interesting & automated election process, to choose which infected machines were good enough to be used as proxies
- Attackers had a pretty good automation game, over the years they automated people out of jobs with the org, and in turn became more secure

**Verdict**: to sum it up, a really interesting video.

## learning resources
- [INE free account](https://checkout.ine.com/starter-pass)
- [CTFtime](https://ctftime.org/)
- [eJPT cert](https://elearnsecurity.com/product/ejpt-certification/)
- {{<youtube SFbV7sTSAlA>}}
  - with strategies on how to get started with blue team work, and work your way to where you want
  - includes study & practice tips too, to especially get you prepared & hireable for that first job in security.
  - 3 things he Neal says you ought to do: **1. free INE cert**; **2. look for free/cheap hands on education**: things like hackthebox, tryhackme, ctftime; **3. make friends in the industry**
  - OSCP, CEH, these certs are the language that recruitment speaks, essentially gatekeeper certs. there's no pressure to rush to this, especially if you're good at what you do.
  - [r/hacking wiki](https://old.reddit.com/r/hacking/wiki/index) - packed packed collection of resources.
  - [AWS Cybersecurity Awareness training](https://learnsecurity.amazon.com/)