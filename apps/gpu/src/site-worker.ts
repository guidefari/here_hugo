type Environment = {
  readonly ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

export default {
  fetch(
    request: Request,
    environment: Environment,
  ): Promise<Response> | Response {
    const url = new URL(request.url)

    if (url.hostname === 'gpu.guidefari.com') {
      url.protocol = 'https:'
      url.hostname = 'research.guidefari.com'
      url.port = ''

      if (url.pathname !== '/gpu' && !url.pathname.startsWith('/gpu/')) {
        url.pathname = `/gpu${url.pathname}`
      }

      if (url.pathname === '/gpu') {
        url.pathname = '/gpu/'
      }

      return Response.redirect(url, 308)
    }

    if (url.pathname === '/gpu' || url.pathname.startsWith('/gpu/')) {
      url.pathname = url.pathname.slice('/gpu'.length) || '/'
    }

    if (url.pathname.startsWith('/scenes/')) {
      url.pathname = '/'
    }

    return environment.ASSETS.fetch(new Request(url, request))
  },
}
