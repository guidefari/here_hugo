import { cache } from "@cf-wasm/og/workerd";
import { OG_IMAGE_PATH, parseTitle } from "./request";
import { renderOgImage } from "./render";

const ALLOWED_METHODS = "GET, HEAD";

function textResponse(body: string, status: number, extraHeaders: HeadersInit = {}): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

export default {
  async fetch(request: Request, _env: unknown, context: ExecutionContext): Promise<Response> {
    cache.setExecutionContext(context);
    const url = new URL(request.url);
    if (url.pathname !== OG_IMAGE_PATH) return textResponse("Not found", 404);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return textResponse("Method not allowed", 405, { Allow: ALLOWED_METHODS });
    }

    try {
      return await renderOgImage(parseTitle(url));
    } catch (cause: unknown) {
      console.error("OG image rendering failed", cause);
      return textResponse("Unable to render image", 500);
    }
  },
} satisfies ExportedHandler;
