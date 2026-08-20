import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    cloudflare({
      config: {
        name: "here-hugo-discord-crosspost",
        main: "./src/index.ts",
        compatibility_date: "2026-07-11",
      },
    }),
  ],
});
