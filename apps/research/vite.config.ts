import { defineConfig } from "vite";
import { foldkit } from "@foldkit/vite-plugin";

const gpuProxy = {
  target: process.env.GPU_PROXY_TARGET ?? "https://gpu.localhost",
  secure: false,
};

export default defineConfig({
  plugins: [foldkit({ devToolsMcpPort: 43989 })],
  resolve: { dedupe: ["effect"] },
  build: { sourcemap: true },
  server: { host: "localhost", port: 1415, proxy: { "/gpu": gpuProxy } },
  preview: {
    host: "127.0.0.1",
    port: 1415,
    allowedHosts: ["nixos-desktop.tail2afaf7.ts.net"],
    proxy: { "/gpu": gpuProxy },
  },
});
