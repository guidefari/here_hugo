import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import { fileURLToPath } from "node:url";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  site: "https://guidefari.com",
  output: "static",
  integrations: [pagefind()],
  trailingSlash: "ignore",
  server: {
    host: "localhost",
    port: 1414,
  },
  markdown: {
    processor: satteri({
      features: {
        smartPunctuation: false,
      },
    }),
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "solarized-dark",
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        bio: fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
        resume: fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
        rss: fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
        content: fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
        "effect-course": fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
        effect: fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
        "effect.website": fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
        "effect.solutions": fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
        "effect.institute": fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
      },
    },
    server: {
      fs: {
        allow: [workspaceRoot],
      },
    },
  },
});
