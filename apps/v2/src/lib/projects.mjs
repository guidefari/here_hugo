export const projects = [
  {
    slug: "goosebumps-fm",
    title: "goosebumps.fm",
    description: "Public archive of curated music",
    github: "https://github.com/guidefari/gbfm",
    website: "https://goosebumps.fm",
    topics: ["sst", "aws", "cloudflare", "effect", "music"],
    motivation: "",
    links: [],
  },
  {
    slug: "opensound",
    title: "opensound",
    description:
      "Effect-based Spotify Web API SDK with type-safe calls, retries, batching, and OpenTelemetry tracing",
    github: "https://github.com/planetaryescape/opensound",
    website: "https://opensound.dev",
    topics: ["sdk", "effect", "spotify", "music"],
    motivation: "",
    links: [],
  },
  {
    slug: "pulse",
    title: "pulse",
    description:
      "CLI tool that recursively scans directories for Git repos and displays a status summary",
    github: "https://github.com/planetaryescape/pulse",
    topics: ["go", "cli"],
    motivation: "",
    links: [],
  },
  {
    slug: "videoshare",
    title: "videoshare",
    description:
      "Share videos with a clean player link, no login required. Effect v4, Cloudflare Workers, HLS via R2",
    github: "https://github.com/planetaryescape/videoshare",
    topics: ["effect", "cloudflare", "r2"],
    motivation:
      "An intersection of things I'm currently obsessed about. Alchemy brings together Infrastructure as Code and Effect, two topics I've been deep in. Foldkit is Effect in the browser, and my first real exposure to the Elm Architecture. The project itself is simple on purpose: send someone a URL, they watch a video, no login. But the stack underneath is where the learning lives.",
    links: [
      {
        label: "Foldkit intro talk",
        url: "https://www.youtube.com/watch?v=-RmRdE3gID0&t=3288s",
        kind: "video",
      },
      {
        label: "Alchemy v2 + Effect walkthrough",
        url: "https://www.youtube.com/watch?v=fPSxB7ZgSJw",
        kind: "video",
      },
      {
        label: "foldkit.dev",
        url: "https://foldkit.dev/",
        kind: "docs",
      },
      {
        label: "Alchemy v2 docs",
        url: "https://v2.alchemy.run",
        kind: "docs",
      },
      {
        label: "The Elm Architecture (TEA)",
        url: "https://digitalgarden.bhekani.com/the-elm-architecture-tea/",
        kind: "article",
      },
    ],
  },
  {
    slug: "abstract-rhythm",
    title: "abstract_rhythm",
    description:
      "Music e-commerce platform: Stripe checkout, R2-backed digital downloads, admin dashboard. Effect on Cloudflare Workers, Astro frontend.",
    github: "https://github.com/guidefari/abstract_rhythm",
    topics: ["effect", "cloudflare", "music"],
    motivation: "",
    links: [],
  },
  {
    slug: "recordbot",
    title: "recordbot",
    description:
      "Turns WhatsApp messages into structured business records — sales, stock, production logs. Go backend, Astro dashboard.",
    github: "https://github.com/guidefari/whatsapp-business-automation",
    topics: ["go", "whatsapp"],
    motivation: "",
    links: [],
  },
  {
    slug: "invoicing",
    title: "invoicing",
    description:
      "Invoice generation for ZAR businesses: customer + product catalog, PDF output, VAT. Effect service layer on Bun, Drizzle + SQLite, TUI + web frontends.",
    github: "https://github.com/guidefari/invoicing",
    topics: ["effect", "sqlite", "bun"],
    motivation:
      "Started as a TUI I was going to use myself, then a client needed an invoice sent the same week and I ran out of time to keep the TUI workflow tight. Pivoted to a web frontend on top of the same Effect service layer, sent the invoice, kept the TUI as a scriptable entry point for my own use.",
    links: [],
  },
];

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}
