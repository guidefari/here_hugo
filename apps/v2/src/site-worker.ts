type SiteAssets = {
  fetch(request: Request): Promise<Response>;
};

type SiteEnvironment = {
  readonly ASSETS: SiteAssets;
};

const apexHostname = "guidefari.com";
const wwwHostname = `www.${apexHostname}`;

export default {
  async fetch(request: Request, environment: SiteEnvironment): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname === wwwHostname) {
      url.hostname = apexHostname;
      return Response.redirect(url, 301);
    }

    return environment.ASSETS.fetch(request);
  },
};
