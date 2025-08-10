---
title: "Eskil Steenberg – You should finish your software – BSC 2025"
date: 2025-08-10T09:19:16+02:00
description: 
tags: []
images: ['https://images-here-hugo.vercel.app/api/og-image?title=You%20should%20finish%20your%20software']
---

{{<youtube EGLoKbBn-VI>}}


# Good Quality Software is Finished:
He critiques the prevalent notion that "maintainable" is the primary measure of software quality, drawing an analogy to a car that breaks daily but is easy to fix, arguing that no one would consider that high quality.

# The Problem with Continuous Improvement
He suggests that a culture of continuous improvement without a clear goal often leads to enshitification and a lack of prioritization.
This mindset of always pushing fixes to "the next patch" results in bad software and is often the fault of developers, not just management.

# Software Should be maintainable by one Person: 
Steenberg strongly asserts that all software should be possible to be written by one person. He believes that even large projects like Chromium can be broken down into manageable components that a single individual could theoretically tackle.

# Accomplishments vs. Capabilities
Developers should focus on gaining capabilities rather than just accumulating accomplishments. A capability means solving a problem so thoroughly (e.g., mastering text rendering) that it remains solved, allowing future projects to build upon this robust foundation without revisiting it. He cites Apple's development of the iPhone as an example of leveraging a decade of built-up capabilities.

# Small Context Windows and True Completion:
To maintain focus and efficiency, developers should keep their "context windows" small. Critically, the mind can only truly let go of code once it's finished and is so excellent that there's no desire to revisit it. He acknowledges his own struggle with "not invented recently" code, where he feels compelled to redesign older but still functional work.

# Extendable and Unopinionated Software: 
Software should be extendable, allowing others to build on top of your work and for your work to be combined (e.g., via Unix pipes). Crucially, do not impose your conventions or worldview on users (e.g., do not force your specific memory allocator or data structures).

# Stable APIs are Paramount
Steenberg considers stable APIs the most underrated feature in computing and "our north star". He emphasizes that collaboration and trust are built when "giants" (platforms, libraries) "stand still," meaning their APIs remain consistent. He highlights the billions lost due to Python 2 to Python 3 migration and praises Windows' long-standing backward compatibility over Apple's frequent breaking changes. He even applies this internally, stating he cannot break APIs for his own employees.

# Typing is Not the Problem: 
He contends that typing speed is not the bottleneck in programming; rather, code is "meant to run". He notes that some code (like parts of the Linux kernel) is optimized for machine execution rather than human readability, which is an acceptable trade-off.

# write 80% of the code, extract reusable libraries, and then revise based on usage. 
For major version jumps (e.g., 2.0), he often wipes the project and starts anew, leveraging the knowledge gained and reusable components from the previous version.

# The Value of Finishing for Reuse: 
His personal experience with writing serialization libraries reinforces that a library must be "so goddamn good" and "rock solid" to be truly trustworthy and reusable forever. This allows him to "put it behind him" and focus on new problems without revisiting old ones.

# Critique of Subscription Models: 
He laments how the shift from one-time software sales to subscription models forces "infinite repeat development" and "infinite cost," leading to projects being canceled even when functionally complete, as seen with the game Battle Aces. He challenges developers to create software they'd be proud of as if it were their last release.