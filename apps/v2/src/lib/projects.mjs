export const projects = [
  {
    slug: "goosebumps-fm",
    title: "goosebumps.fm",
    description: "Public archive of curated music",
    github: "https://github.com/guidefari/gbfm",
    website: "https://goosebumps.fm",
    topics: [],
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
    topics: [],
    motivation: "",
    links: [],
  },
  {
    slug: "pulse",
    title: "pulse",
    description:
      "CLI tool that recursively scans directories for Git repos and displays a status summary",
    github: "https://github.com/planetaryescape/pulse",
    topics: [],
    motivation: "",
    links: [],
  },
  {
    slug: "videoshare",
    title: "videoshare",
    description:
      "Share videos with a clean player link, no login required. Effect v4, Cloudflare Workers, HLS via R2",
    github: "https://github.com/planetaryescape/videoshare",
    topics: ["effect", "iac", "elm-architecture", "cloudflare"],
    motivation:
      "An intersection of things I'm currently obsessed with. Alchemy brings together Infrastructure as Code and Effect, two topics I've been deep in. Foldkit is Effect in the browser, and my first real exposure to the Elm Architecture. The project itself is simple on purpose: send someone a URL, they watch a video, no login. But the stack underneath is where the learning lives.",
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
];

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}
