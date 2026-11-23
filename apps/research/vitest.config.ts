import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { dedupe: ["effect"] },
  test: {
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
    environment: "happy-dom",
    setupFiles: ["./src/vitest-setup.ts"],
    server: { deps: { inline: ["foldkit", "@foldkit/devtools"] } },
  },
});
