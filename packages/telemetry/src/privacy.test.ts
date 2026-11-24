import { BrowserClient, defaultStackParser } from "@sentry/browser";
import type { BrowserOptions } from "@sentry/browser";
import { describe, expect, test } from "vitest";
import { browserOptions } from "./index";
import { routeName, scrubSpan } from "./privacy";

describe("browser telemetry privacy", () => {
  test("scrubs real SDK error envelopes before transport while retaining stack locations", async () => {
    const secret = "synthetic-secret-never-export";
    const envelopes: unknown[] = [];
    const client = new BrowserClient({
      ...browserOptions("research", "test-revision"),
      integrations: [],
      stackParser: defaultStackParser,
      transport: () => ({
        send: async (envelope) => {
          envelopes.push(envelope);
          return { statusCode: 200 };
        },
        flush: async () => true,
      }),
    });
    client.init();
    client.captureEvent({
      message: secret,
      user: { email: secret },
      request: { url: `https://research.test/?token=${secret}`, headers: { authorization: secret } },
      extra: { payload: secret },
      breadcrumbs: [{ message: secret }],
      contexts: { application: { secret } },
      exception: { values: [{
        type: "TypeError",
        value: secret,
        stacktrace: { frames: [{
          filename: `https://research.test/assets/reader.js?token=${secret}`,
          function: "renderReport",
          lineno: 42,
          colno: 7,
          vars: { secret },
          context_line: secret,
        }] },
      }] },
    });
    expect(await client.flush(2000)).toBe(true);
    const serialized = JSON.stringify(envelopes);
    expect(envelopes).toHaveLength(1);
    expect(serialized).not.toContain(secret);
    expect(serialized).toContain("renderReport");
    expect(serialized).toContain("reader.js");
    expect(serialized).toContain("research");
    await client.close(2000);
  });

  test("removes streamed-span attributes and links while preserving timings and parentage", () => {
    const secret = "synthetic-private-query";
    const span: Parameters<NonNullable<BrowserOptions["beforeSendSpan"]>>[0] = {
      trace_id: "0123456789abcdef0123456789abcdef",
      parent_span_id: "0123456789abcdef",
      span_id: "abcdef0123456789",
      name: `/reports/sops/?query=${secret}`,
      start_timestamp: 1,
      end_timestamp: 2,
      status: "ok",
      is_segment: true,
      attributes: { "sentry.op": "navigation", "http.url": secret, query: secret },
    };
    const result = scrubSpan(span, "research", "test-revision");
    expect(JSON.stringify(result)).not.toContain(secret);
    expect(result.name).toBe("/reports/:report");
    expect(result.parent_span_id).toBe(span.parent_span_id);
    expect(result.end_timestamp).toBe(2);
    expect(result.attributes["sentry.environment"]).toBe("production");
    expect(result.attributes["sentry.release"]).toBe("here-hugo@test-revision");
  });

  test("oracle regression: bounds routes when URL.canParse is unavailable", () => {
    const descriptor = Object.getOwnPropertyDescriptor(URL, "canParse");
    try {
      Reflect.deleteProperty(URL, "canParse");
      expect(() => routeName("research", "/reports/private?token=secret")).not.toThrow();
      expect(routeName("research", "/reports/private?token=secret")).toBe("/reports/:report");
      expect(routeName("gpu", "/scenes/private?token=secret")).toBe("/scenes/:scene");
      expect(routeName("blog", "/private?token=secret")).toBe("/:page");
      expect(routeName("blog", "https://[invalid")).toBe("/");
    } finally {
      if (descriptor) Object.defineProperty(URL, "canParse", descriptor);
    }
  });

  test("uses bounded route names and explicitly samples production performance", () => {
    expect(routeName("blog", "/private-page?query=sensitive")).toBe("/:page");
    expect(routeName("gpu", "/scenes/noise-beams")).toBe("/scenes/:scene");
    expect(routeName("research", "https://research.guidefari.com/reports/sops/?private=sensitive")).toBe("/reports/:report");
    expect(routeName("blog", "https://guidefari.com/")).toBe("/");
    expect(browserOptions("research").tracesSampleRate).toBe(0.1);
    expect(browserOptions("research").dataCollection?.userInfo).toBe(false);
    expect(browserOptions("research").tracePropagationTargets).toEqual([]);
  });
});
