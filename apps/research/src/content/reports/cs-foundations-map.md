---
title: "A computer science foundations map for systems engineering"
description: "A revisitable self-study backbone spanning mathematics, algorithms, theory, architecture, languages, systems, and engineering, with project-driven routes through it."
date: "2026-11-26"
tags: ["computer-science", "systems", "curriculum", "learning"]
draft: true
---

> Agent-written curriculum proposal for review. This is a learning map, not a claim of completed study, a degree-equivalence programme, or a reconstruction of an earlier university syllabus.

The aim is strong systems engineering grounded in computer science, not just
familiarity with infrastructure tools. That means understanding both how a system
works and how to reason about its correctness, cost, limits, and consequences.

The structure supplies coverage. Curiosity supplies entry points. A project can
send us into an operating-systems question without requiring a semester of maths
first, but the map must make the missing foundations visible rather than quietly
dropping them.

## The shape of the map

Four connected strands form the backbone:

| Strand | Modules | What it contributes |
| --- | --- | --- |
| Mathematical and theoretical reasoning | 1. Discrete mathematics and proof; 2. Probability, statistics, and quantitative methods; 3. Algorithms and data structures; 4. Computability and complexity | Reason about correctness, uncertainty, efficiency, and what computation can do. |
| Machines, programs, and execution | 5. Representation and architecture; 6. Programming and abstraction; 7. Languages, compilers, and runtimes; 8. Operating systems and systems programming | Follow an idea from source code down to instructions, memory, processes, and devices. |
| State and communication | 9. Concurrency and parallelism; 10. Networking; 11. Databases and storage; 12. Distributed systems | Understand shared state, communication, persistence, and independent failures. |
| Trust, evidence, and engineering | 13. Security; 14. Software engineering and formal reasoning; 15. Performance and experimental methods; 16. Reliability and operations | Build systems whose behaviour can be justified, measured, secured, and recovered. |

Human-computer interaction, graphics, AI, scientific computing, and societal
questions provide breadth beyond the systems emphasis. They are part of the map,
not proof that every subject needs equal study time.

These are proposed study modules, not official university course titles. The
numbering gives them stable references; it is not a compulsory teaching order.

<figure class="diagram" aria-labelledby="cs-routes-caption">
<p class="diagram-title">Two useful prerequisite routes through the backbone</p>
<div class="d-lanes">
<section class="d-lane">
<h3 class="d-lane-name">Reasoning about a program</h3>
<ol class="d-flow">
<li class="d-node"><b>Logic and proof</b><span>State assumptions and invariants.</span></li>
<li class="d-node"><b>Algorithms and analysis</b><span>Explain why an approach works and what it costs.</span></li>
<li class="d-node"><b>Computability and complexity</b><span>Distinguish an implementation problem from a fundamental limit.</span></li>
</ol>
</section>
<section class="d-lane">
<h3 class="d-lane-name">Reasoning about execution</h3>
<ol class="d-flow">
<li class="d-node"><b>Representation and architecture</b><span>Understand instructions, memory, and devices.</span></li>
<li class="d-node"><b>Operating systems and concurrency</b><span>Understand execution, isolation, scheduling, and shared state.</span></li>
<li class="d-node"><b>Networked and distributed systems</b><span>Add communication and failures across machines.</span></li>
</ol>
</section>
</div>
<figcaption id="cs-routes-caption">Arrows show useful preparation, not the complete dependency graph. Probability, languages, storage, security, and engineering connect across both routes.</figcaption>
</figure>

## Mathematical and theoretical reasoning

### 1. Discrete mathematics and proof

**Central question:** how do we make a precise claim about a program, and justify it?

- Propositional and predicate logic; sets, relations, and functions.
- Direct proof, contradiction, induction, and structural induction.
- Invariants, recursion, recurrences, counting, and basic combinatorics.
- Graphs, trees, reachability, partial orders, and elementary number theory.

**Useful preparation:** basic algebra. Learn proof alongside small programs,
not as a gate that keeps all programming on hold.

**Experiment:** prove an invariant for binary search, then find which code
changes invalidate the proof. Represent a build's dependencies as a directed
graph and explain when a valid build order exists.

### 2. Probability, statistics, and quantitative methods

**Central question:** what can a measurement or probabilistic claim actually tell us?

- Conditional probability, Bayes' rule, random variables, expectation, variance,
  and common distributions.
- Sampling, bias, uncertainty, experimental design, and statistical inference.
- Vectors, matrices, linear transformations, and numerical representation.
- Supporting calculus, optimization, numerical error, and basic queueing models
  as the chosen applications require them.

**Useful preparation:** algebra and functions; counting supports probability.
Calculus is useful preparation for continuous probability and deeper numerical work.

**Experiment:** compare two latency distributions with similar averages but
different tails. Explain what sampling changes about the conclusions.

### 3. Algorithms and data structures

**Central question:** which representation and algorithm fit this problem, and why?

- Arrays, linked structures, stacks, queues, hash tables, heaps, and balanced trees.
- Graph representations, traversal, shortest paths, and topological sorting.
- Searching, sorting, divide-and-conquer, greedy methods, and dynamic programming.
- Correctness, asymptotic bounds, amortized analysis, and time/space tradeoffs.
- How locality, allocation, and I/O can change the practical result.

**Useful preparation:** programming, discrete mathematics, and proof. Architecture
adds a second explanation for differences asymptotic analysis does not capture.

**Experiment:** compare a heap-backed priority queue with a sorted-array version.
Predict their behaviour before measuring different workload sizes.

### 4. Computability and complexity

**Central question:** is a problem solvable at all, and what resources does solving it require?

- Finite automata, regular languages, grammars, and pushdown automata.
- Models of computation, Turing machines, decidability, and the halting problem.
- Reductions; polynomial time; P, NP, and NP-completeness.
- The distinction between undecidable, expensive, and merely poorly implemented.

**Useful preparation:** logic, proof, discrete structures, and algorithm analysis.

**Experiment:** connect a tiny tokenizer to a finite-state machine. Work through
a small reduction and explain what it establishes, rather than memorizing a list
of difficult problems.

## Machines, programs, and execution

### 5. Data representation and computer architecture

**Central question:** what does the machine actually execute and store?

- Binary and hexadecimal; signed integers; floating point; text encodings.
- Boolean algebra, combinational/sequential logic, and the idea of a processor.
- Instruction sets, registers, assembly, calling conventions, and execution.
- Cache hierarchy, locality, memory access, interrupts, devices, and I/O.
- Pipelining, multicore machines, and the distinction between an instruction-set
  architecture and a particular implementation.

**Useful preparation:** basic programming and binary arithmetic.

**Experiment:** inspect the assembly for a small function. Compare sequential
and pointer-chasing memory access, separating a prediction about caches from
what the measurements actually establish.

### 6. Programming foundations and abstraction

**Central question:** how do we turn a specification into a comprehensible program?

- Control flow, recursion, decomposition, and data modelling.
- Imperative, functional, and object-oriented approaches and their tradeoffs.
- Interfaces, modules, abstraction boundaries, effects, and error handling.
- References, ownership, aliasing, resource lifetime, and memory safety.
- Reading unfamiliar code and understanding a specification before implementing it.

**Useful preparation:** none beyond basic programming exposure. This module is
also where gaps from day-to-day application work can be made explicit.

**Experiment:** implement the same small state machine in two programming styles.
Explain what each makes easy to express and what errors it permits.

### 7. Programming languages, compilers, and runtimes

**Central question:** how does source code acquire meaning and become execution?

- Syntax, parsing, abstract syntax trees, scope, bindings, and evaluation.
- Type systems, type checking, polymorphism, and soundness at an introductory level.
- Interpreters, intermediate representations, optimization, and code generation.
- Stacks, heaps, garbage collection, runtime scheduling, and event loops.
- Foreign-function interfaces, linking, and the limits of guarantees across boundaries.

**Useful preparation:** programming and data structures. Architecture helps with
code generation; formal languages helps with parsing; logic helps with type rules.

**Experiment:** build a small expression interpreter with variables and errors.
Add a type checker, then distinguish a rejected program from a runtime failure.

### 8. Operating systems and systems programming

**Central question:** how does an OS share a machine while protecting its users and processes?

- System calls, privilege, processes, threads, scheduling, and context switches.
- Virtual memory, address spaces, paging, allocation, and protection.
- File descriptors, filesystems, device interfaces, pipes, and sockets.
- Executable loading, process environments, signals, and resource cleanup.
- Containers and virtualization built on these mechanisms, not in place of them.

**Useful preparation:** architecture and memory representation; a small amount
of C or another language that exposes low-level interfaces is useful.

**Experiment:** inspect a process's system calls and memory map. Build a small
shell pipeline and identify which process owns each file descriptor.

## State and communication

### 9. Concurrency and parallelism

**Central question:** which interleavings are possible, and which must be prevented?

- Interleavings, races, atomicity, ordering, and memory models.
- Mutexes, condition variables, semaphores, atomics, and message passing.
- Deadlock, starvation, contention, and synchronization costs.
- Task parallelism, data parallelism, work distribution, and speedup limits.
- Cancellation, bounded queues, backpressure, and resource ownership.

**Useful preparation:** processes, threads, memory, and invariants.

**Experiment:** produce a lost update, fix it, then explain why the fix works.
Bound a producer/consumer queue and observe the difference between backpressure
and unbounded memory growth.

### 10. Networking

**Central question:** what happens between an application write and another machine's read?

- Layering, encapsulation, addressing, Ethernet/Wi-Fi, IP, and routing.
- UDP and TCP; reliability, flow control, congestion control, and connection state.
- DNS, HTTP, TLS, proxies, load balancers, and connection reuse.
- Latency, bandwidth, loss, buffering, timeouts, and failure diagnosis.

**Useful preparation:** OS processes, sockets, and binary representation.
Probability and queueing become useful for performance.

**Experiment:** trace a DNS lookup and connection using packet capture. Introduce
latency or packet loss in a disposable environment and explain the observed
application behaviour.

### 11. Databases, storage, and information management

**Central question:** how do we organize, query, and change durable data correctly?

- Relational modelling, keys, normalization, relational algebra, and SQL.
- Indexes, B-trees, hash indexes, log-structured designs, and storage layout.
- Query planning, joins, selectivity, and the cost of moving data.
- Transactions, isolation, concurrency control, logging, and crash recovery.
- Backups, retention, schema evolution, and the difference between persistence
  and a tested recovery path.

**Useful preparation:** data structures, algorithms, OS I/O, and concurrency.

**Experiment:** inspect a query plan before and after adding an index. Crash a
disposable store at a chosen write boundary and investigate what survives.

### 12. Distributed systems

**Central question:** what can we guarantee when state and failures span machines?

- Partial failure, timing assumptions, clocks, and ordering.
- Replication, consistency models, quorums, leader election, and consensus.
- Delivery semantics, idempotency, retries, deduplication, and coordination.
- Partitions, availability tradeoffs, distributed transactions, and convergence.
- Control loops and reconciliation as practical applications, not substitutes
  for the underlying failure model.

**Useful preparation:** networking, concurrency, storage, and proof/invariants.

**Experiment:** simulate a replicated key/value store, introduce a partition,
and state precisely which reads and writes your design permits.

## Trust, evidence, and engineering

### 13. Security foundations

**Central question:** what is trusted, what can an attacker do, and where is protection enforced?

- Threat modelling, trust boundaries, least privilege, and isolation.
- Authentication, authorization, identity, capabilities, and access-control models.
- Cryptographic hashes, MACs, signatures, encryption, key exchange, and certificates.
- Key management, secret distribution, supply-chain security, and common exploit classes.
- Security properties and usability under failure, recovery, and operational pressure.

**Useful preparation:** networking, OS protection, probability, and basic number
theory. Studying primitives is not a reason to implement production cryptography.

**Experiment:** trace one credential from its creation to its consumer. Identify
which copies are plaintext, who can access them, and what revocation really changes.

### 14. Software engineering and formal reasoning

**Central question:** how do we change software while retaining evidence that it behaves correctly?

- Requirements, specifications, modularity, API contracts, and design tradeoffs.
- Unit/integration/system tests, property-based testing, and test limitations.
- Debugging, static analysis, code review, version control, and maintenance.
- State machines, preconditions/postconditions, invariants, and introductory model checking.
- Build systems, reproducibility, dependency management, and collaborative change.

**Useful preparation:** programming; proof and language semantics strengthen the
reasoning. Return to this module throughout the map.

**Experiment:** describe a retrying operation as a state machine, generate failure
sequences, and check an invariant that a happy-path test would miss.

### 15. Performance and experimental methods

**Central question:** what explains a performance result, and what evidence would disprove that explanation?

- Complexity versus measured cost; latency, throughput, utilization, and saturation.
- Profiling, tracing, benchmarking, instrumentation overhead, and measurement bias.
- Queueing, tail latency, load generation, and workload selection.
- CPU, memory, disk, network, and lock contention as competing explanations.

**Useful preparation:** statistics, architecture, OS, and algorithm analysis.

**Experiment:** write down a bottleneck hypothesis, design a measurement that could
refute it, change one factor, and report both the result and its limits.

### 16. Reliability, operations, and recovery

**Central question:** what happens outside the successful steady-state path?

- Fault models, failure detection, redundancy, recovery, and capacity.
- Timeouts, retry budgets, overload, admission control, and graceful degradation.
- Observability, service objectives, incident investigation, and postmortems.
- Deployment, configuration, reconciliation, rollback, and disaster recovery.
- Testing the assumptions that backups, alerts, and runbooks depend on.

**Useful preparation:** concurrency, networking, storage, distributed systems,
and experimental methods. This is an engineering synthesis, not a replacement
for those foundations.

**Experiment:** restore a disposable service from its documented inputs. Record
what was missing, what depended on an unavailable service, and which guarantees
were assumed rather than tested.

## Breadth that keeps this from becoming only a systems syllabus

The systems emphasis determines depth, not the outer boundary of computer science.

| Area | An introductory foothold | Connection back to systems |
| --- | --- | --- |
| Human-computer interaction and accessibility | Task analysis, mental models, usability evaluation, inclusive interaction | Can a person operate or recover the system without misunderstanding it? |
| AI and machine learning | Search, optimization, learning, evaluation, uncertainty, and data quality | What resources, failure modes, privacy boundaries, and evaluation assumptions does a model-backed system introduce? |
| Graphics and interactive computing | Geometry, transformations, rendering, rasterization, and event-driven interaction | How do mathematical models meet hardware, latency budgets, and human perception? |
| Scientific and numerical computing | Floating-point error, conditioning, stability, approximation, and numerical algorithms | When is a computed answer misleading even though the code has no obvious bug? |
| Specialized platforms | Embedded, mobile, web, and accelerator constraints; real-time interaction; power and memory budgets | Which assumptions break when software leaves a general-purpose server? |
| Ethics, society, and professional responsibility | Privacy, accessibility, abuse, environmental cost, accountability, and competing interests | Who bears the cost of a technical decision, and what does correctness leave out? |

These deserve both explicit study and recurring questions inside the core modules.
Security, ethics, and accessibility should not wait until a final optional chapter.

## A structured route without a rigid timetable

Use these as successive passes, revisiting subjects at greater depth.

1. **Recover the vocabulary:** programming/abstraction, discrete maths, data
   structures, binary representation, and an introductory view of a whole computer.
2. **Explain execution:** architecture, systems programming, OS, language runtimes,
   and concurrency. Continue proofs and algorithm analysis alongside them.
3. **Explain communication and durable state:** networking, databases, and
   distributed systems. Bring probability and measurement into the experiments.
4. **Make the reasoning explicit:** formal languages, computability, complexity,
   type systems, and correctness arguments. Begin introductory theory earlier;
   this pass deepens it rather than introducing it for the first time.
5. **Integrate and revisit:** security, performance, reliability, and a breadth
   subject connected to a real question.

A project question can move a topic forward. Record the prerequisite it exposes
and return to it; do not turn every detour into a requirement to finish three
textbooks before continuing.

## Project-driven routes into the foundations

| Starting question | Route through the map | Evidence of understanding |
| --- | --- | --- |
| Why does Docker need a VM on macOS? | Representation/architecture → OS → isolation → virtualization | Explain which kernel executes a container's syscalls and separate OS compatibility from instruction-set compatibility. |
| What does Flux actually reconcile? | State machines → control loops → distributed failures → reliability | Describe desired and observed state, convergence, and what must exist before reconciliation can begin. |
| What does SOPS protect? | Data representation → cryptographic primitives → identity → trust boundaries | Draw the data-key and identity boundary without claiming the runtime copies remain encrypted. |
| Where does an observability trace go? | Networking → queues/backpressure → storage → sampling/statistics | Follow a span through buffering, transport, ingestion, retention, and query, identifying where it can be lost. |
| Why is this query slow? | Data structures → storage layout → query planning → measurement | Explain a query plan and distinguish an index hypothesis from demonstrated improvement. |
| Why is this release or job duplicated? | State machines → concurrency → delivery semantics → idempotency | State the durable invariant and show how a retry behaves after an ambiguous outcome. |
| Why does an Effect service boundary help? | Abstraction → types/contracts → dependency composition → testing | Separate what the contract guarantees from what an implementation happens to do. |

Projects test understanding; they do not establish coverage on their own. A working
deployment can coexist with gaps in proof, algorithm analysis, or computer architecture.

## How a module becomes a lasting learning note

Keep one small record per topic:

- **Question:** the thing being explained, not just a course name.
- **Mental model:** a diagram, invariant, or mechanism that makes a prediction.
- **Prerequisites:** the concepts needed, with gaps marked explicitly.
- **Experiment:** a small observable result, including the predicted outcome.
- **Teach-back:** an explanation without copying the resource.
- **Evidence and limits:** what was checked and what remains an assumption.
- **Connections:** the projects and neighbouring concepts it changes.
- **Return trigger:** an unresolved question, a failure to explain it, or a later
  project that makes the concept relevant again.

Use a lightweight status such as **unexplored**, **recognizable**, **explainable**,
or **applied**, with a date and evidence. These are learning signals, not permanent
certifications. Revisit by retrieval and a changed problem, not only rereading.

The next step is to calibrate a few modules against existing knowledge and choose
one project route. There is no need to fill every module with courses, deadlines,
and exercises before starting.

## A NUST reference that may help recover earlier knowledge

A near-period comparison is the National University of Science and Technology
in Bulawayo, Zimbabwe, not the similarly named institutions in Pakistan or Namibia.
An official faculty prospectus indexed as **Yearbook 2018/19**, and an official
Computer Science page dated June 2019, list these first two years:

| Stage | Listed modules |
| --- | --- |
| Part I, semester I | Introduction to Computer Science & Programming; Mathematical Foundations for Computer Science; Operating Systems Concepts; Computational Research Methods; Calculus I; Linear Algebra |
| Part I, semester II | Structured Program Design; Database Concepts; Logic Design & Switching Circuits; Software Engineering Concepts; Visual Programming Concepts & Development; Conflict Transformation & Leadership |
| Part II, semester I | Computer Data Communications; Computer Architecture; Data Structures & Algorithms; Systems Analysis & Design; Object Oriented Software Concepts & Development; Operations Research |
| Part II, semester II | Software Design Methodologies; Advanced Mathematical Structures for Computing; Internet & Web Design; Societal Computing; Computer Networks & Applications; Computational Modelling |

Sources: [official faculty prospectus](https://www.nust.ac.zw/fas/images/documents/faculty-of-applied-sciences-prospectus-2019.pdf),
[official Computer Science programme page](https://www.nust.ac.zw/index.php/component/content/article/bachelor-of-science-honours-in-computer-science.html?catid=110&Itemid=437).

**Evidence limit:** direct retrieval of these NUST sources failed during research;
the list comes from substantial search-indexed extracts of the official URLs.
The 2018/19 label is close-period evidence, not an exact 2016/17 or 2017/18
curriculum, and it does not establish any person's enrolled or completed modules.
Use it as a recognition aid, not a reconstructed transcript.

For example, "Mathematical Foundations" in the indexed programme description
includes logic, sets, relations, functions, combinatorics, discrete probability,
invariants, and recurrences. Some topics may therefore need retrieval and practice
rather than a first introduction. The next step is to recognize the names, then
test what can actually be explained.

## Sources, scope, and open decisions

Researched on 26 November 2026. The grouping, study passes, experiments, and
revisiting method are a personal curriculum proposal, not an official ACM
syllabus or a prescribed degree sequence.

### Coverage reference: CS2023

The joint ACM/IEEE-CS/AAAI [CS2023 knowledge-area index](https://csed.acm.org/knowledge-areas/)
and [final report](https://csed.acm.org/final-report/) supply the coverage check.
Its 17 areas are not 17 compulsory courses in a fixed order. The final report
distinguishes shared CS Core from deeper knowledge-area study.

| Proposed strand | Related official knowledge areas |
| --- | --- |
| Mathematical/theoretical reasoning | Mathematical and Statistical Foundations; Algorithmic Foundations |
| Machines, programs, execution | Architecture and Organization; Systems Fundamentals; Software Development Fundamentals; Foundations of Programming Languages; Operating Systems |
| State and communication | Data Management; Networking and Communication; Parallel and Distributed Computing |
| Trust and engineering | Security; Software Engineering; Systems Fundamentals, with cross-area applications |
| Deliberate breadth and recurring human concerns | Artificial Intelligence; Graphics and Interactive Techniques; Human-Computer Interaction; Specialized Platform Development; Society, Ethics, and the Profession |

Performance and reliability are explicit modules here because of the systems
engineering goal. That is a study-design choice, not a claim that CS2023 names
them as separate knowledge areas.

### Structural comparison: MIT

MIT's [2026/27 Computer Science and Engineering degree chart](https://catalog.mit.edu/degree-charts/computer-science-engineering-course-6-3/)
combines programming and software construction, mathematics for CS, algorithms,
theory/algorithm-analysis alternatives, systems alternatives, low-level C and
assembly, computation structures, and further mathematics and track electives.
It supports the need for a mathematical and theoretical backbone, not just
an operations syllabus. Its alternatives remain alternatives: it does not
require every systems course or every mathematical elective listed there.

One possible later resource is [MIT's Fall 2025 Operating System Engineering](https://pdos.csail.mit.edu/6.1810/2025/overview.html),
which teaches through extending the xv6 operating system. It is a dated
course resource, not a claim of current enrolment or access to MIT assessment.

### Decisions still to make

Open decisions:

- Which modules are familiar enough for a short diagnostic rather than a full course?
- Which low-level language should support the systems experiments?
- Which project question should be the first route through the map?
- Which resources suit the learner's preferred depth and learning style?
