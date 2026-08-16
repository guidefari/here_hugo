import * as Alchemy from "alchemy";
import { adopt } from "alchemy/AdoptPolicy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Command from "alchemy/Command";
import * as Namespace from "alchemy/Namespace";
import * as Output from "alchemy/Output";
import * as Effect from "effect/Effect";

const zoneDomain = "guidefari.com";
const mediaDomain = `media.${zoneDomain}`;
const ogDomain = `og.${zoneDomain}`;
const compatibilityDate = "2026-07-11";

export default Alchemy.Stack(
  "here-hugo",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const stack = yield* Alchemy.Stack;
    const isProduction = stack.stage === "prod";

    const site = yield* Effect.gen(function* () {
      const build = yield* Command.Build("Build", {
        cwd: "apps/v2",
        command: "bun run build",
        outdir: "dist",
        memo: {
          include: ["src/**", "public/**", "astro.config.mjs", "package.json"],
        },
      });
      const buildHash = Output.map(build.hash, ({ output }) => {
        if (output === undefined) {
          throw new Error("Site build did not produce an output hash");
        }
        return output;
      });

      return yield* Cloudflare.Worker("Worker", {
        name: isProduction
          ? "here-hugo-prod-siterouterscript"
          : `here-hugo-${stack.stage}-site`,
        main: "apps/v2/src/site-worker.ts",
        domain: isProduction ? zoneDomain : undefined,
        url: !isProduction,
        compatibility: { date: compatibilityDate },
        assets: {
          directory: build.outdir,
          hash: buildHash,
          notFoundHandling: "404-page",
          runWorkerFirst: true,
        },
      });
    }).pipe(Namespace.push("Site"), adopt(isProduction));

    const ogImage = yield* Cloudflare.Worker("OgImage", {
      name: `here-hugo-${stack.stage}-og-image`,
      main: "apps/og-image/dist/here_hugo_og_image/index.js",
      bundle: false,
      domain: isProduction ? ogDomain : undefined,
      url: !isProduction,
      compatibility: { date: compatibilityDate },
      observability: {
        enabled: true,
        logs: {
          enabled: true,
          invocationLogs: true,
        },
      },
    });

    const media = yield* Cloudflare.R2.Bucket("Media", {
      name: isProduction
        ? "here-hugo-prod-media"
        : `here-hugo-${stack.stage}-media`,
      domains: isProduction
        ? [{ name: mediaDomain, minTLS: "1.2" }]
        : [],
    }).pipe(Namespace.push("Media"), adopt(isProduction));

    return {
      ogImageUrl: ogImage.url,
      mediaUrl: isProduction ? `https://${mediaDomain}` : undefined,
      url: site.url,
    };
  }),
);
