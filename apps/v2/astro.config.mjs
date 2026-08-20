import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { satteri } from "@astrojs/markdown-satteri";
import { fileURLToPath } from "node:url";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url));
const markdownPassthroughLayout = fileURLToPath(
  new URL("./src/layouts/MarkdownPassthrough.astro", import.meta.url),
);
const { ASTRO_ALLOWED_HOST: allowedHost } = loadEnv(
  process.env.NODE_ENV ?? "development",
  workspaceRoot,
  "",
);

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
    server: {
      ...(allowedHost ? { allowedHosts: [allowedHost] } : {}),
      fs: {
        allow: [workspaceRoot],
      },
    },
    resolve: {
      alias: [
        "bio",
        "resume",
        "rss",
        "content",
        "effect-course",
        "effect",
        "effect.website",
        "effect.solutions",
        "effect.institute",
      ].map((layout) => ({
        find: new RegExp(`^${layout.replaceAll(".", "\\.")}$`),
        replacement: markdownPassthroughLayout,
      })),
    },
  },
});
