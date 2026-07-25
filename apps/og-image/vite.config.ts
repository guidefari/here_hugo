import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import arrayBuffer from "vite-plugin-arraybuffer";

export default defineConfig({
  plugins: [arrayBuffer(), cloudflare()],
});
