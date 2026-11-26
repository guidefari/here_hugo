type Service = {
  fetch(request: Request): Promise<Response>;
};

type Environment = {
  readonly ASSETS: Service;
  readonly GPU: Service;
};

export default {
  fetch(request: Request, environment: Environment): Promise<Response> | Response {
    const url = new URL(request.url);
    if (url.pathname === "/gpu") {
      url.pathname = "/gpu/";
      return Response.redirect(url, 308);
    }
    if (url.pathname.startsWith("/gpu/")) {
      return environment.GPU.fetch(request);
    }
    return environment.ASSETS.fetch(request);
  },
};
