import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  site: "https://guidefari.com",
  output: "static",
  trailingSlash: "always",
  server: {
    host: "localhost",
    port: 1414,
  },
  markdown: {
    syntaxHighlight: "shiki",
  },
  vite: {
    resolve: {
      alias: {
        bio: fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
        resume: fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
        rss: fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
        content: fileURLToPath(new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url)),
      },
    },
    server: {
      fs: {
        allow: [workspaceRoot],
      },
    },
  },
});
