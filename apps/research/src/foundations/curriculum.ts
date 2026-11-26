export type StrandId = "theory" | "machines" | "state" | "engineering";

export type Strand = {
  readonly id: StrandId;
  readonly title: string;
  readonly contribution: string;
  readonly knowledgeAreas: ReadonlyArray<string>;
};

export type Module = {
  readonly id: string;
  readonly number: number;
  readonly strand: StrandId;
  readonly title: string;
  readonly short: string;
  readonly question: string;
  readonly topics: ReadonlyArray<string>;
  readonly preparation: string;
  readonly helpfulFirst: ReadonlyArray<string>;
  readonly experiment: string;
};

export type BreadthArea = {
  readonly id: string;
  readonly title: string;
  readonly foothold: string;
  readonly connection: string;
};

export type RouteStep = {
  readonly concept: string;
  readonly module: string;
};

export type ProjectRoute = {
  readonly id: string;
  readonly question: string;
  readonly steps: ReadonlyArray<RouteStep>;
  readonly evidence: string;
};

export type StudyPass = {
  readonly number: number;
  readonly title: string;
  readonly summary: string;
  readonly modules: ReadonlyArray<string>;
  readonly alongside: ReadonlyArray<string>;
  readonly includesBreadth: boolean;
};

export const strands: ReadonlyArray<Strand> = [
  {
    id: "theory",
    title: "Mathematical and theoretical reasoning",
    contribution: "Reason about correctness, uncertainty, efficiency, and what computation can do.",
    knowledgeAreas: ["Mathematical and Statistical Foundations", "Algorithmic Foundations"],
  },
  {
    id: "machines",
    title: "Machines, programs, and execution",
    contribution: "Follow an idea from source code down to instructions, memory, processes, and devices.",
    knowledgeAreas: [
      "Architecture and Organization", "Systems Fundamentals", "Software Development Fundamentals",
      "Foundations of Programming Languages", "Operating Systems",
    ],
  },
  {
    id: "state",
    title: "State and communication",
    contribution: "Understand shared state, communication, persistence, and independent failures.",
    knowledgeAreas: ["Data Management", "Networking and Communication", "Parallel and Distributed Computing"],
  },
  {
    id: "engineering",
    title: "Trust, evidence, and engineering",
    contribution: "Build systems whose behaviour can be justified, measured, secured, and recovered.",
    knowledgeAreas: ["Security", "Software Engineering", "Systems Fundamentals, with cross-area applications"],
  },
];

export const modules: ReadonlyArray<Module> = [
  {
    id: "discrete-maths",
    number: 1,
    strand: "theory",
    title: "Discrete mathematics and proof",
    short: "Discrete maths and proof",
    question: "How do we make a precise claim about a program, and justify it?",
    topics: [
      "Propositional and predicate logic; sets, relations, and functions.",
      "Direct proof, contradiction, induction, and structural induction.",
      "Invariants, recursion, recurrences, counting, and basic combinatorics.",
      "Graphs, trees, reachability, partial orders, and elementary number theory.",
    ],
    preparation: "Basic algebra. Learn proof alongside small programs, not as a gate that keeps all programming on hold.",
    helpfulFirst: [],
    experiment: "Prove an invariant for binary search, then find which code changes invalidate the proof. Represent a build's dependencies as a directed graph and explain when a valid build order exists.",
  },
  {
    id: "probability-statistics",
    number: 2,
    strand: "theory",
    title: "Probability, statistics, and quantitative methods",
    short: "Probability and statistics",
    question: "What can a measurement or probabilistic claim actually tell us?",
    topics: [
      "Conditional probability, Bayes' rule, random variables, expectation, variance, and common distributions.",
      "Sampling, bias, uncertainty, experimental design, and statistical inference.",
      "Vectors, matrices, linear transformations, and numerical representation.",
      "Supporting calculus, optimization, numerical error, and basic queueing models as the chosen applications require them.",
    ],
    preparation: "Algebra and functions; counting supports probability. Calculus is useful preparation for continuous probability and deeper numerical work.",
    helpfulFirst: ["discrete-maths"],
    experiment: "Compare two latency distributions with similar averages but different tails. Explain what sampling changes about the conclusions.",
  },
  {
    id: "algorithms",
    number: 3,
    strand: "theory",
    title: "Algorithms and data structures",
    short: "Algorithms and data structures",
    question: "Which representation and algorithm fit this problem, and why?",
    topics: [
      "Arrays, linked structures, stacks, queues, hash tables, heaps, and balanced trees.",
      "Graph representations, traversal, shortest paths, and topological sorting.",
      "Searching, sorting, divide-and-conquer, greedy methods, and dynamic programming.",
      "Correctness, asymptotic bounds, amortized analysis, and time/space tradeoffs.",
      "How locality, allocation, and I/O can change the practical result.",
    ],
    preparation: "Programming, discrete mathematics, and proof. Architecture adds a second explanation for differences asymptotic analysis does not capture.",
    helpfulFirst: ["programming-abstraction", "discrete-maths", "architecture"],
    experiment: "Compare a heap-backed priority queue with a sorted-array version. Predict their behaviour before measuring different workload sizes.",
  },
  {
    id: "computability-complexity",
    number: 4,
    strand: "theory",
    title: "Computability and complexity",
    short: "Computability and complexity",
    question: "Is a problem solvable at all, and what resources does solving it require?",
    topics: [
      "Finite automata, regular languages, grammars, and pushdown automata.",
      "Models of computation, Turing machines, decidability, and the halting problem.",
      "Reductions; polynomial time; P, NP, and NP-completeness.",
      "The distinction between undecidable, expensive, and merely poorly implemented.",
    ],
    preparation: "Logic, proof, discrete structures, and algorithm analysis.",
    helpfulFirst: ["discrete-maths", "algorithms"],
    experiment: "Connect a tiny tokenizer to a finite-state machine. Work through a small reduction and explain what it establishes, rather than memorizing a list of difficult problems.",
  },
  {
    id: "architecture",
    number: 5,
    strand: "machines",
    title: "Data representation and computer architecture",
    short: "Representation and architecture",
    question: "What does the machine actually execute and store?",
    topics: [
      "Binary and hexadecimal; signed integers; floating point; text encodings.",
      "Boolean algebra, combinational/sequential logic, and the idea of a processor.",
      "Instruction sets, registers, assembly, calling conventions, and execution.",
      "Cache hierarchy, locality, memory access, interrupts, devices, and I/O.",
      "Pipelining, multicore machines, and the distinction between an instruction-set architecture and a particular implementation.",
    ],
    preparation: "Basic programming and binary arithmetic.",
    helpfulFirst: ["programming-abstraction"],
    experiment: "Inspect the assembly for a small function. Compare sequential and pointer-chasing memory access, separating a prediction about caches from what the measurements actually establish.",
  },
  {
    id: "programming-abstraction",
    number: 6,
    strand: "machines",
    title: "Programming foundations and abstraction",
    short: "Programming and abstraction",
    question: "How do we turn a specification into a comprehensible program?",
    topics: [
      "Control flow, recursion, decomposition, and data modelling.",
      "Imperative, functional, and object-oriented approaches and their tradeoffs.",
      "Interfaces, modules, abstraction boundaries, effects, and error handling.",
      "References, ownership, aliasing, resource lifetime, and memory safety.",
      "Reading unfamiliar code and understanding a specification before implementing it.",
    ],
    preparation: "None beyond basic programming exposure. This module is also where gaps from day-to-day application work can be made explicit.",
    helpfulFirst: [],
    experiment: "Implement the same small state machine in two programming styles. Explain what each makes easy to express and what errors it permits.",
  },
  {
    id: "languages-compilers",
    number: 7,
    strand: "machines",
    title: "Programming languages, compilers, and runtimes",
    short: "Languages, compilers, runtimes",
    question: "How does source code acquire meaning and become execution?",
    topics: [
      "Syntax, parsing, abstract syntax trees, scope, bindings, and evaluation.",
      "Type systems, type checking, polymorphism, and soundness at an introductory level.",
      "Interpreters, intermediate representations, optimization, and code generation.",
      "Stacks, heaps, garbage collection, runtime scheduling, and event loops.",
      "Foreign-function interfaces, linking, and the limits of guarantees across boundaries.",
    ],
    preparation: "Programming and data structures. Architecture helps with code generation; formal languages helps with parsing; logic helps with type rules.",
    helpfulFirst: ["programming-abstraction", "algorithms", "architecture", "computability-complexity", "discrete-maths"],
    experiment: "Build a small expression interpreter with variables and errors. Add a type checker, then distinguish a rejected program from a runtime failure.",
  },
  {
    id: "operating-systems",
    number: 8,
    strand: "machines",
    title: "Operating systems and systems programming",
    short: "Operating systems",
    question: "How does an OS share a machine while protecting its users and processes?",
    topics: [
      "System calls, privilege, processes, threads, scheduling, and context switches.",
      "Virtual memory, address spaces, paging, allocation, and protection.",
      "File descriptors, filesystems, device interfaces, pipes, and sockets.",
      "Executable loading, process environments, signals, and resource cleanup.",
      "Containers and virtualization built on these mechanisms, not in place of them.",
    ],
    preparation: "Architecture and memory representation; a small amount of C or another language that exposes low-level interfaces is useful.",
    helpfulFirst: ["architecture"],
    experiment: "Inspect a process's system calls and memory map. Build a small shell pipeline and identify which process owns each file descriptor.",
  },
  {
    id: "concurrency",
    number: 9,
    strand: "state",
    title: "Concurrency and parallelism",
    short: "Concurrency and parallelism",
    question: "Which interleavings are possible, and which must be prevented?",
    topics: [
      "Interleavings, races, atomicity, ordering, and memory models.",
      "Mutexes, condition variables, semaphores, atomics, and message passing.",
      "Deadlock, starvation, contention, and synchronization costs.",
      "Task parallelism, data parallelism, work distribution, and speedup limits.",
      "Cancellation, bounded queues, backpressure, and resource ownership.",
    ],
    preparation: "Processes, threads, memory, and invariants.",
    helpfulFirst: ["operating-systems", "architecture", "discrete-maths"],
    experiment: "Produce a lost update, fix it, then explain why the fix works. Bound a producer/consumer queue and observe the difference between backpressure and unbounded memory growth.",
  },
  {
    id: "networking",
    number: 10,
    strand: "state",
    title: "Networking",
    short: "Networking",
    question: "What happens between an application write and another machine's read?",
    topics: [
      "Layering, encapsulation, addressing, Ethernet/Wi-Fi, IP, and routing.",
      "UDP and TCP; reliability, flow control, congestion control, and connection state.",
      "DNS, HTTP, TLS, proxies, load balancers, and connection reuse.",
      "Latency, bandwidth, loss, buffering, timeouts, and failure diagnosis.",
    ],
    preparation: "OS processes, sockets, and binary representation. Probability and queueing become useful for performance.",
    helpfulFirst: ["operating-systems", "architecture", "probability-statistics"],
    experiment: "Trace a DNS lookup and connection using packet capture. Introduce latency or packet loss in a disposable environment and explain the observed application behaviour.",
  },
  {
    id: "databases-storage",
    number: 11,
    strand: "state",
    title: "Databases, storage, and information management",
    short: "Databases and storage",
    question: "How do we organize, query, and change durable data correctly?",
    topics: [
      "Relational modelling, keys, normalization, relational algebra, and SQL.",
      "Indexes, B-trees, hash indexes, log-structured designs, and storage layout.",
      "Query planning, joins, selectivity, and the cost of moving data.",
      "Transactions, isolation, concurrency control, logging, and crash recovery.",
      "Backups, retention, schema evolution, and the difference between persistence and a tested recovery path.",
    ],
    preparation: "Data structures, algorithms, OS I/O, and concurrency.",
    helpfulFirst: ["algorithms", "operating-systems", "concurrency"],
    experiment: "Inspect a query plan before and after adding an index. Crash a disposable store at a chosen write boundary and investigate what survives.",
  },
  {
    id: "distributed-systems",
    number: 12,
    strand: "state",
    title: "Distributed systems",
    short: "Distributed systems",
    question: "What can we guarantee when state and failures span machines?",
    topics: [
      "Partial failure, timing assumptions, clocks, and ordering.",
      "Replication, consistency models, quorums, leader election, and consensus.",
      "Delivery semantics, idempotency, retries, deduplication, and coordination.",
      "Partitions, availability tradeoffs, distributed transactions, and convergence.",
      "Control loops and reconciliation as practical applications, not substitutes for the underlying failure model.",
    ],
    preparation: "Networking, concurrency, storage, and proof/invariants.",
    helpfulFirst: ["networking", "concurrency", "databases-storage", "discrete-maths"],
    experiment: "Simulate a replicated key/value store, introduce a partition, and state precisely which reads and writes your design permits.",
  },
  {
    id: "security",
    number: 13,
    strand: "engineering",
    title: "Security foundations",
    short: "Security",
    question: "What is trusted, what can an attacker do, and where is protection enforced?",
    topics: [
      "Threat modelling, trust boundaries, least privilege, and isolation.",
      "Authentication, authorization, identity, capabilities, and access-control models.",
      "Cryptographic hashes, MACs, signatures, encryption, key exchange, and certificates.",
      "Key management, secret distribution, supply-chain security, and common exploit classes.",
      "Security properties and usability under failure, recovery, and operational pressure.",
    ],
    preparation: "Networking, OS protection, probability, and basic number theory. Studying primitives is not a reason to implement production cryptography.",
    helpfulFirst: ["networking", "operating-systems", "probability-statistics", "discrete-maths"],
    experiment: "Trace one credential from its creation to its consumer. Identify which copies are plaintext, who can access them, and what revocation really changes.",
  },
  {
    id: "software-engineering",
    number: 14,
    strand: "engineering",
    title: "Software engineering and formal reasoning",
    short: "Software engineering",
    question: "How do we change software while retaining evidence that it behaves correctly?",
    topics: [
      "Requirements, specifications, modularity, API contracts, and design tradeoffs.",
      "Unit/integration/system tests, property-based testing, and test limitations.",
      "Debugging, static analysis, code review, version control, and maintenance.",
      "State machines, preconditions/postconditions, invariants, and introductory model checking.",
      "Build systems, reproducibility, dependency management, and collaborative change.",
    ],
    preparation: "Programming; proof and language semantics strengthen the reasoning. Return to this module throughout the map.",
    helpfulFirst: ["programming-abstraction", "discrete-maths", "languages-compilers"],
    experiment: "Describe a retrying operation as a state machine, generate failure sequences, and check an invariant that a happy-path test would miss.",
  },
  {
    id: "performance",
    number: 15,
    strand: "engineering",
    title: "Performance and experimental methods",
    short: "Performance and experiments",
    question: "What explains a performance result, and what evidence would disprove that explanation?",
    topics: [
      "Complexity versus measured cost; latency, throughput, utilization, and saturation.",
      "Profiling, tracing, benchmarking, instrumentation overhead, and measurement bias.",
      "Queueing, tail latency, load generation, and workload selection.",
      "CPU, memory, disk, network, and lock contention as competing explanations.",
    ],
    preparation: "Statistics, architecture, OS, and algorithm analysis.",
    helpfulFirst: ["probability-statistics", "architecture", "operating-systems", "algorithms"],
    experiment: "Write down a bottleneck hypothesis, design a measurement that could refute it, change one factor, and report both the result and its limits.",
  },
  {
    id: "reliability",
    number: 16,
    strand: "engineering",
    title: "Reliability, operations, and recovery",
    short: "Reliability and recovery",
    question: "What happens outside the successful steady-state path?",
    topics: [
      "Fault models, failure detection, redundancy, recovery, and capacity.",
      "Timeouts, retry budgets, overload, admission control, and graceful degradation.",
      "Observability, service objectives, incident investigation, and postmortems.",
      "Deployment, configuration, reconciliation, rollback, and disaster recovery.",
      "Testing the assumptions that backups, alerts, and runbooks depend on.",
    ],
    preparation: "Concurrency, networking, storage, distributed systems, and experimental methods. This is an engineering synthesis, not a replacement for those foundations.",
    helpfulFirst: ["concurrency", "networking", "databases-storage", "distributed-systems", "performance"],
    experiment: "Restore a disposable service from its documented inputs. Record what was missing, what depended on an unavailable service, and which guarantees were assumed rather than tested.",
  },
];

export const breadth: ReadonlyArray<BreadthArea> = [
  {
    id: "hci-accessibility",
    title: "Human-computer interaction and accessibility",
    foothold: "Task analysis, mental models, usability evaluation, inclusive interaction.",
    connection: "Can a person operate or recover the system without misunderstanding it?",
  },
  {
    id: "ai-machine-learning",
    title: "AI and machine learning",
    foothold: "Search, optimization, learning, evaluation, uncertainty, and data quality.",
    connection: "What resources, failure modes, privacy boundaries, and evaluation assumptions does a model-backed system introduce?",
  },
  {
    id: "graphics",
    title: "Graphics and interactive computing",
    foothold: "Geometry, transformations, rendering, rasterization, and event-driven interaction.",
    connection: "How do mathematical models meet hardware, latency budgets, and human perception?",
  },
  {
    id: "numerical-computing",
    title: "Scientific and numerical computing",
    foothold: "Floating-point error, conditioning, stability, approximation, and numerical algorithms.",
    connection: "When is a computed answer misleading even though the code has no obvious bug?",
  },
  {
    id: "specialized-platforms",
    title: "Specialized platforms",
    foothold: "Embedded, mobile, web, and accelerator constraints; real-time interaction; power and memory budgets.",
    connection: "Which assumptions break when software leaves a general-purpose server?",
  },
  {
    id: "ethics-society",
    title: "Ethics, society, and professional responsibility",
    foothold: "Privacy, accessibility, abuse, environmental cost, accountability, and competing interests.",
    connection: "Who bears the cost of a technical decision, and what does correctness leave out?",
  },
];

export const routes: ReadonlyArray<ProjectRoute> = [
  {
    id: "docker-on-macos",
    question: "Why does Docker need a VM on macOS?",
    steps: [
      { concept: "Representation and architecture", module: "architecture" },
      { concept: "Operating systems", module: "operating-systems" },
      { concept: "Isolation", module: "security" },
      { concept: "Virtualization", module: "operating-systems" },
    ],
    evidence: "Explain which kernel executes a container's syscalls and separate OS compatibility from instruction-set compatibility.",
  },
  {
    id: "flux-reconciliation",
    question: "What does Flux actually reconcile?",
    steps: [
      { concept: "State machines", module: "software-engineering" },
      { concept: "Control loops", module: "distributed-systems" },
      { concept: "Distributed failures", module: "distributed-systems" },
      { concept: "Reliability", module: "reliability" },
    ],
    evidence: "Describe desired and observed state, convergence, and what must exist before reconciliation can begin.",
  },
  {
    id: "sops",
    question: "What does SOPS protect?",
    steps: [
      { concept: "Data representation", module: "architecture" },
      { concept: "Cryptographic primitives", module: "security" },
      { concept: "Identity", module: "security" },
      { concept: "Trust boundaries", module: "security" },
    ],
    evidence: "Draw the data-key and identity boundary without claiming the runtime copies remain encrypted.",
  },
  {
    id: "observability-trace",
    question: "Where does an observability trace go?",
    steps: [
      { concept: "Networking", module: "networking" },
      { concept: "Queues and backpressure", module: "concurrency" },
      { concept: "Storage", module: "databases-storage" },
      { concept: "Sampling and statistics", module: "probability-statistics" },
    ],
    evidence: "Follow a span through buffering, transport, ingestion, retention, and query, identifying where it can be lost.",
  },
  {
    id: "slow-query",
    question: "Why is this query slow?",
    steps: [
      { concept: "Data structures", module: "algorithms" },
      { concept: "Storage layout", module: "databases-storage" },
      { concept: "Query planning", module: "databases-storage" },
      { concept: "Measurement", module: "performance" },
    ],
    evidence: "Explain a query plan and distinguish an index hypothesis from demonstrated improvement.",
  },
  {
    id: "duplicate-jobs",
    question: "Why is this release or job duplicated?",
    steps: [
      { concept: "State machines", module: "software-engineering" },
      { concept: "Concurrency", module: "concurrency" },
      { concept: "Delivery semantics", module: "distributed-systems" },
      { concept: "Idempotency", module: "distributed-systems" },
    ],
    evidence: "State the durable invariant and show how a retry behaves after an ambiguous outcome.",
  },
  {
    id: "effect-service-boundary",
    question: "Why does an Effect service boundary help?",
    steps: [
      { concept: "Abstraction", module: "programming-abstraction" },
      { concept: "Types and contracts", module: "languages-compilers" },
      { concept: "Dependency composition", module: "programming-abstraction" },
      { concept: "Testing", module: "software-engineering" },
    ],
    evidence: "Separate what the contract guarantees from what an implementation happens to do.",
  },
];

export const passes: ReadonlyArray<StudyPass> = [
  {
    number: 1,
    title: "Recover the vocabulary",
    summary: "Programming and abstraction, discrete maths, data structures, binary representation, and an introductory view of a whole computer.",
    modules: ["programming-abstraction", "discrete-maths", "algorithms", "architecture"],
    alongside: [],
    includesBreadth: false,
  },
  {
    number: 2,
    title: "Explain execution",
    summary: "Architecture, systems programming, OS, language runtimes, and concurrency. Continue proofs and algorithm analysis alongside them.",
    modules: ["architecture", "operating-systems", "languages-compilers", "concurrency"],
    alongside: ["discrete-maths", "algorithms"],
    includesBreadth: false,
  },
  {
    number: 3,
    title: "Explain communication and durable state",
    summary: "Networking, databases, and distributed systems. Bring probability and measurement into the experiments.",
    modules: ["networking", "databases-storage", "distributed-systems"],
    alongside: ["probability-statistics", "performance"],
    includesBreadth: false,
  },
  {
    number: 4,
    title: "Make the reasoning explicit",
    summary: "Formal languages, computability, complexity, type systems, and correctness arguments. Begin introductory theory earlier; this pass deepens it rather than introducing it for the first time.",
    modules: ["computability-complexity", "languages-compilers", "software-engineering"],
    alongside: [],
    includesBreadth: false,
  },
  {
    number: 5,
    title: "Integrate and revisit",
    summary: "Security, performance, reliability, and a breadth subject connected to a real question.",
    modules: ["security", "performance", "reliability"],
    alongside: [],
    includesBreadth: true,
  },
];

export const topicRecord: ReadonlyArray<readonly [string, string]> = [
  ["Question", "The thing being explained, not just a course name."],
  ["Mental model", "A diagram, invariant, or mechanism that makes a prediction."],
  ["Prerequisites", "The concepts needed, with gaps marked explicitly."],
  ["Experiment", "A small observable result, including the predicted outcome."],
  ["Teach-back", "An explanation without copying the resource."],
  ["Evidence and limits", "What was checked and what remains an assumption."],
  ["Connections", "The projects and neighbouring concepts it changes."],
  ["Return trigger", "An unresolved question, a failure to explain it, or a later project that makes the concept relevant again."],
];

export const openDecisions: ReadonlyArray<string> = [
  "Which modules are familiar enough for a short diagnostic rather than a full course?",
  "Which low-level language should support the systems experiments?",
  "Which project question should be the first route through the map?",
  "Which resources suit the learner's preferred depth and learning style?",
];
