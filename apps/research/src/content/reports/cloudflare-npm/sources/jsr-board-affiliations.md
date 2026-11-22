---
title: "JSR board affiliations and open source status"
description: "Supporting evidence for the Cloudflare and npm research pack. Findings, inferences, and gaps as of 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","source-notes"]
draft: false
parent: "cloudflare-npm"
---

Research cutoff and retrieval date: November 8, 2026. Sources below were opened and their contents read, not merely copied from search snippets. Undated personal pages are current retrieval evidence, not independently timestamped employment records. This file supplements, rather than changes, the earlier research and article.

## Who is currently listed on the JSR governance board?

### Takeaway

The current published roster still lists the same five people announced February 3, 2025: Evan You, Isaac Schlueter, James Snell, Luca Casonato, and Ryan Dahl. Treat this as the **currently published roster**, not as independent confirmation that all five are actively attending or that no unpublished resignation has occurred: the governance page has demonstrably stale organizational and employer descriptions. [Current governance page](https://jsr.io/docs/governance); [original announcement](https://deno.com/blog/jsr-open-governance-board)

### Cited Findings

- The live page explicitly introduces the five names as its current members, but still associates Schlueter with vlt and Casonato with Deno. Those associations must not be used as current employment evidence. The same page says a board is still being established even while listing its members and linking its meeting notes. [Governance documentation](https://jsr.io/docs/governance)
- The original announcement was published February 3, 2025, with the identical five-person roster. Leo Kettmeir is an announcement coauthor, not one of the five announced board members. [Announcement](https://deno.com/blog/jsr-open-governance-board)
- The live charter specifies five members, no term limits, no formal chair/secretary roles, majority votes and quorum of three. A member may resign in writing; removal requires a majority vote of the remaining board. It describes the board initially as an informal group and finding a legal home as a goal. Do not recast these members as directors of an independently incorporated nonprofit without separate evidence. [Current charter](https://jsr.io/docs/governance/charter)
- Checked the issue list linked by the governance page through the GitHub API because GitHub HTML fetches timed out. The `meeting` label returned four issues, including only two explicitly titled board meetings: January 27, 2025 and April 17, 2025. January lists all five attendees; April lists Dahl, You and Snell. The April notes discuss exploratory OpenJS/Linux Foundation/nonprofit options, not a completed foundation transfer. [January minutes](https://github.com/jsr-io/jsr/issues/912); [April minutes](https://github.com/jsr-io/jsr/issues/1084); [checked API listing](https://api.github.com/repos/jsr-io/jsr/issues?labels=meeting&state=all&per_page=100)
- The 2026 meeting-label result is a September 3 open community meeting agenda, not board minutes or an updated board election. Do not infer board membership from open-meeting participation, project contribution, or moderation appointment. [September agenda](https://github.com/jsr-io/jsr/issues/1512); [April moderator appointments](https://github.com/jsr-io/jsr/issues/1084)

### Inferences

- Best defensible formulation: “JSR's published board roster lists five people. Three currently have Cloudflare affiliations, one works at Sentry, and one works at Railway.” The employment evidence is in the next section; this is not a claim of a freshly reconstituted or independently audited board. [Roster](https://jsr.io/docs/governance)
- Shared employment can create concentration questions, but is not evidence of improper voting, employer instructions, or legal Cloudflare ownership. The charter expressly requires conflicts to be disclosed and conflicted members to recuse. [Charter, sections 4, 6 and 11](https://jsr.io/docs/governance/charter)

### Gaps

- No additions, departures or roster replacement were found in the checked current governance page, charter, or linked meeting-label records. This is a bounded search result, not proof there are no other records.
- No post-October-2026 board minutes, individual membership reconfirmations, completed foundation transfer, conflict disclosures or revised employer-representation rules were verified. The published minutes trail is sparse and the documentation is stale.

## Where does each listed board member currently work?

### Takeaway

**Not all five work at Cloudflare. Luca Casonato explicitly says he works at Railway and previously worked at Deno. Isaac Z. Schlueter's own resume and Sentry's author biography identify him as a Sentry Staff Software Engineer.** You, Snell and Dahl have direct first-party Cloudflare affiliation evidence. [Casonato](https://lcas.dev/); [Schlueter resume](https://izs.me/resume); [Sentry biography](https://blog.sentry.io/authors/isaac-schlueter/); [You](https://blog.cloudflare.com/voidzero-update/); [Snell](https://www.jasnell.me/about); [Dahl](https://blog.cloudflare.com/deno-joins-cloudflare/)

### Cited Findings

| Listed board member | Current employer / role as supported by primary sources | Evidence date | Confidence and caveats |
| --- | --- | --- | --- |
| **Evan You** | **Cloudflare, continuing to lead the VoidZero open source toolchain**. His own announcement explicitly includes “Evan and the rest of the VoidZero team”; his later Cloudflare article describes the team as already part of Cloudflare. [Personal company announcement](https://voidzero.dev/posts/voidzero-cloudflare); [Cloudflare update authored by You](https://blog.cloudflare.com/voidzero-update/) | June 4 and September 28, 2026; retrieved November 8 | High for Cloudflare affiliation and continued toolchain leadership. Exact legal employing subsidiary, contract and internal job grade are not disclosed. “Founder of VoidZero” and “creator of Vue/Vite” remain biographical facts, not competing proof that he is independent today. |
| **Isaac Schlueter**, self-styled **Isaac Z. Schlueter** | **Sentry, Inc., Staff Software Engineer, JavaScript SDKs**. His resume says November 2025 to present; Sentry's own author biography corroborates the role. [Personal resume](https://izs.me/resume); [employer biography](https://blog.sentry.io/authors/isaac-schlueter/) | Resume: November 2025 to present, undated page retrieved November 8, 2026. Employer biography retrieved November 8 and links his October 9, 2026 SDK article. | Very high. Resume explicitly ends vlt employment July 2025 and GitHub employment November 2021. Creator of npm and former vlt cofounder do not mean current npm, GitHub, Microsoft or vlt employee. Any retained equity or advisory position is unverified. |
| **James Snell**, also **James M. Snell** | **Cloudflare, Workers runtime engineer**. Personal site says Principal Engineer; Cloudflare Connect 2026 transcript at 0:50 has him call himself a **senior principal engineer at Cloudflare** working on the Workers runtime. [Personal biography](https://www.jasnell.me/about); [company-hosted 2026 session and transcript](https://www.cloudflare.com/connect/2026/session/a-runtime-for-developers-and-their-agents/) | Connect 2026 source; both pages retrieved November 8, 2026. The fetched session does not specify an individual session day. | Very high for employer and team. Title wording varies: event speaker card and personal site say Principal Engineer, transcript says senior principal engineer; use “Workers runtime engineer at Cloudflare” when exact grade is immaterial. Node.js TSC and standards roles are separate project/standards affiliations, not employers. |
| **Luca Casonato** | **Railway**. His own homepage says “I work at Railway” and “I previously worked at the Deno company.” [Personal homepage](https://lcas.dev/) | Undated live page retrieved November 8, 2026 | Very high for employer; exact current title and joining date were not established from an opened primary source. Do not infer Cloudflare employment from the October “entire Deno team” announcement: he explicitly identifies Deno as former employment. His Deno/JSR contribution history and continued published board seat are not employment evidence. |
| **Ryan Dahl** | **Cloudflare, leading work on self-hosted workerd / Workers programming model with Bert Belder**. Cloudflare's joint post labels him “Deno (and now Cloudflare)” and explicitly names Ryan and Bert as leading the new effort. Dahl's own Deno announcement gives a Cloudflare contact address. [Joint company announcement](https://blog.cloudflare.com/deno-joins-cloudflare/); [Dahl's announcement](https://deno.com/blog/cloudflare) | October 9, 2026; Cloudflare page metadata says updated October 13; retrieved November 8 | Very high for Cloudflare affiliation and announced leadership responsibility. Exact employment title and employing subsidiary are not disclosed. Creator of Node.js/Deno is biography, not a claim that Node.js employs him. |

- **Critical correction to the earlier research's tentative Luca inference:** “The entire Deno team” is a statement about the team at the time of the October 9 announcement. It is not a claim about every former Deno employee or every person the February 2025 board announcement described as Deno staff. Casonato's own current homepage expressly says Railway and former Deno. [October announcement](https://deno.com/blog/cloudflare); [Casonato's homepage](https://lcas.dev/)
- **Isaac chronology:** self-reported current Sentry employment starts November 2025; vlt February 2024 to July 2025; GitHub April 2020 to November 2021; npm Inc. January 2014 to April 2020. His employer's author page confirms the Sentry JavaScript SDK position. The live JSR roster's vlt label is therefore stale as an employment identifier. [Resume](https://izs.me/resume); [Sentry](https://blog.sentry.io/authors/isaac-schlueter/); [JSR roster](https://jsr.io/docs/governance)
- **Evan chronology:** his June announcement describes independent development from 2016 to 2023, founding VoidZero in 2023, and the team joining Cloudflare in June 2026. His September 28 article uses completed-tense language about having joined and being part of Cloudflare. Do not use historical independence to label him presently independent. [June first-person announcement](https://voidzero.dev/posts/voidzero-cloudflare); [September first-person update](https://blog.cloudflare.com/voidzero-update/)
- **Ryan individually named, not merely inferred:** the Cloudflare post explicitly identifies him as now at Cloudflare. Conversely, that post does not name Luca as a joiner. [Joint announcement](https://blog.cloudflare.com/deno-joins-cloudflare/)

### Inferences

- Counting current employer affiliations against the published roster yields **Cloudflare 3/5, Sentry 1/5, Railway 1/5**. This is a mapping of individuals, not formal corporate board seats. There is no basis here to say all five are Cloudflare employees, all five are independent, or companies legally appoint or direct these seats. [Roster](https://jsr.io/docs/governance); [charter](https://jsr.io/docs/governance/charter); [You](https://blog.cloudflare.com/voidzero-update/); [Snell](https://www.jasnell.me/about); [Dahl](https://blog.cloudflare.com/deno-joins-cloudflare/); [Schlueter](https://izs.me/resume); [Casonato](https://lcas.dev/)
- Three common affiliations are relevant to majority-voting governance, but actual outcomes depend on participation, conflicts, recusals and voting. No reviewed evidence establishes coordinated votes, misconduct, or Cloudflare instruction. [Voting and recusal rules](https://jsr.io/docs/governance/charter)

### Gaps

- No payroll records or employment contracts were reviewed. Employer affiliation evidence should not be overstated as identifying each exact legal employing entity, subsidiary, employment classification, or internal reporting chain.
- Luca's exact job title and joining/leaving dates remain unverified from opened primary pages. Search surfaced a LinkedIn result suggesting Railway from July 2026 and Deno ending April 2026, but it was not opened and is deliberately not used as verified evidence.
- Evan's exact Cloudflare job title, Ryan's formal title, and the reason for James's principal/senior-principal wording variation remain unresolved. The functional descriptions above avoid inventing precise grades.
- No evidence establishes that any of these five is merely on a Cloudflare advisory board instead of the work affiliations described above. JSR governance membership itself is a separate role from employment.

## Is JSR itself open source, and where are its codebases?

### Takeaway

**Yes. JSR's registry server and web frontend are open source under the MIT license, not just an open source client for a proprietary registry.** The main repository explicitly identifies itself as the source of jsr.io and supplies instructions for running the entire stack locally. [Main repository README](https://raw.githubusercontent.com/jsr-io/jsr/main/README.md); [MIT license](https://raw.githubusercontent.com/jsr-io/jsr/main/LICENSE); [technical governance description](https://jsr.io/docs/governance)

### Cited Findings

| Codebase / component | Direct source link | Verified scope |
| --- | --- | --- |
| JSR registry monorepo | [jsr-io/jsr](https://github.com/jsr-io/jsr) | Registry source, API and frontend; the README calls this the source for jsr.io. [Read README](https://raw.githubusercontent.com/jsr-io/jsr/main/README.md) |
| Registry backend | [api/](https://github.com/jsr-io/jsr/tree/main/api) | Main README describes a Rust management API and PostgreSQL database. [README](https://raw.githubusercontent.com/jsr-io/jsr/main/README.md) |
| Web frontend and governance docs | [frontend/](https://github.com/jsr-io/jsr/tree/main/frontend) | Fresh frontend; JSR governance page's own edit link points into this tree. [README](https://raw.githubusercontent.com/jsr-io/jsr/main/README.md); [governance page](https://jsr.io/docs/governance) |
| JSR npm command-line integration | [jsr-io/jsr-npm](https://github.com/jsr-io/jsr-npm) | README documents add/remove/publish/run, npm alias and registry configuration, and MIT licensing. [Read README](https://raw.githubusercontent.com/jsr-io/jsr-npm/main/README.md) |
| Deno CLI, including native publication implementation | [denoland/deno](https://github.com/denoland/deno) | JSR technical governance says package upload is embedded in the Deno CLI and the npm jsr package wraps this functionality. This paragraph may be stale regarding extraction, so it is not proof that every npm CLI function is only a wrapper. [Governance technical policy](https://jsr.io/docs/governance); [Deno source link in company announcement](https://deno.com/blog/cloudflare) |
| Documentation generator | [denoland/deno_doc](https://github.com/denoland/deno_doc) | Main JSR README explicitly says documentation generation is done through deno_doc and describes local contribution integration. [README](https://raw.githubusercontent.com/jsr-io/jsr/main/README.md) |

- The main repository's license is headed “MIT License,” copyright 2024 the JSR authors, and grants use, copying, modification, distribution, sublicensing and sale, subject to preserving the copyright and permission notices. This is a software license, not a transfer of the hosted service's domain, data, namespace rights or legal entity. [Actual license file](https://raw.githubusercontent.com/jsr-io/jsr/main/LICENSE)
- **New primary evidence relevant to the earlier migration gap:** the current main README describes modules, metadata and npm tarballs on Cloudflare R2; a Fresh frontend running as a Worker; and a Cloudflare Worker load balancer. It still describes the management API on Google Cloud Run and PostgreSQL on Google Cloud SQL. This supports a current *documented hybrid architecture*, not “everything is already on Cloudflare.” The deployed configuration was not independently measured. [Current README](https://raw.githubusercontent.com/jsr-io/jsr/main/README.md)
- October 9's Deno announcement says JSR will continue operating with its infrastructure moving to Cloudflare. It does not itself settle legal ownership or board changes. [Announcement](https://deno.com/blog/cloudflare)

### Inferences

- Accurate user-facing answer: “JSR itself is MIT-licensed open source, including its backend and frontend. The code is at github.com/jsr-io/jsr; the npm-facing CLI is at github.com/jsr-io/jsr-npm.” Open code and local stack instructions give a real software exit, but do not alone reproduce production data, accounts, package names, moderation authority or operating funding. [Registry README](https://raw.githubusercontent.com/jsr-io/jsr/main/README.md); [license](https://raw.githubusercontent.com/jsr-io/jsr/main/LICENSE); [CLI README](https://raw.githubusercontent.com/jsr-io/jsr-npm/main/README.md)

### Gaps

- No production export, independent full-registry mirror, deployed infrastructure audit, or legal title audit was performed. Software openness should not be conflated with independently governed legal ownership or complete hosted-service portability.
- GitHub HTML retrieval failed for the main repository and meeting search; the raw README/license endpoints and GitHub API succeeded and were read directly. Repository links above are backed by those opened first-party contents, not search snippets.
