import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import arrayBuffer from "vite-plugin-arraybuffer";

export default defineConfig({
  plugins: [
    arrayBuffer(),
    cloudflare({
      config: {
        name: "here-hugo-og-image",
        main: "./src/index.ts",
        compatibility_date: "2026-07-11",
      },
    }),
  ],
});
