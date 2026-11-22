import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://research.guidefari.com",
  output: "static",
  trailingSlash: "always",
  server: { host: "localhost", port: 1415 },
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
