/// <reference path="./.sst/platform/config.d.ts" />

const zoneDomain = "guidefari.com";
const wwwDomain = `www.${zoneDomain}`;

export default $config({
  app() {
    return {
      name: "here-hugo",
      removal: "retain",
      home: "cloudflare",
      providers: {
        cloudflare: "6.14.0",
      },
    };
  },
  async run() {
    const site = new sst.cloudflare.StaticSiteV2("Site", {
      path: ".",
      domain: {
        name: zoneDomain,
        redirects: [wwwDomain],
      },
      notFound: "404",
      build: {
        command: "bun run build",
        output: "public",
      },
      dev: {
        command: "bun run dev",
        directory: ".",
        autostart: true,
      },
    });

    return {
      url: site.url,
    };
  },
});
