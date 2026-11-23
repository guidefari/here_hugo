import type { BrowserOptions, ErrorEvent, StackFrame } from "@sentry/browser";

export type Application = "blog" | "research" | "gpu";
type BrowserSpan = Parameters<NonNullable<BrowserOptions["beforeSendSpan"]>>[0];

const errorTypes = new Set([
  "Error", "TypeError", "RangeError", "ReferenceError", "SyntaxError",
  "URIError", "EvalError", "AggregateError",
]);
const operations = new Set(["pageload", "navigation", "ui.render", "resource.script", "resource.css"]);

export function routeName(application: Application, path: string) {
  const base = "https://here-hugo.invalid";
  const pathname = URL.canParse(path, base) ? new URL(path, base).pathname : "/";
  if (pathname === "/") return "/";
  if (application === "research" && pathname.startsWith("/reports/")) return "/reports/:report";
  if (application === "gpu" && pathname.startsWith("/scenes/")) return "/scenes/:scene";
  return "/:page";
}

export function scrubError(event: ErrorEvent, application: Application): ErrorEvent {
  const trace = event.contexts?.trace;
  return {
    type: undefined,
    ...(event.event_id ? { event_id: event.event_id } : {}),
    ...(event.timestamp ? { timestamp: event.timestamp } : {}),
    level: event.level ?? "error",
    platform: "javascript",
    ...(event.release ? { release: event.release } : {}),
    environment: "production",
    tags: { application },
    ...(trace?.trace_id && trace.span_id ? {
      contexts: { trace: { trace_id: trace.trace_id, span_id: trace.span_id } },
    } : {}),
    exception: {
      values: (event.exception?.values ?? []).map((exception) => ({
        type: exception.type && errorTypes.has(exception.type) ? exception.type : "Error",
        value: "Application error; inspect the sanitized stack.",
        mechanism: { type: "generic", handled: exception.mechanism?.handled ?? false },
        stacktrace: { frames: (exception.stacktrace?.frames ?? []).map(scrubFrame) },
      })),
    },
  };
}

function scrubFrame(frame: StackFrame): StackFrame {
  return {
    filename: (frame.filename ?? "unknown").split(/[?#]/)[0] ?? "unknown",
    function: frame.function ?? "anonymous",
    lineno: frame.lineno ?? 0,
    colno: frame.colno ?? 0,
    in_app: frame.in_app ?? false,
  };
}

export function scrubSpan(span: BrowserSpan, application: Application, release?: string): BrowserSpan {
  const operation = span.attributes["sentry.op"];
  const safeOperation = typeof operation === "string" && operations.has(operation) ? operation : "ui.render";
  return {
    trace_id: span.trace_id,
    ...(span.parent_span_id ? { parent_span_id: span.parent_span_id } : {}),
    span_id: span.span_id,
    name: span.is_segment ? routeName(application, span.name) : safeOperation,
    start_timestamp: span.start_timestamp,
    ...(span.end_timestamp !== undefined ? { end_timestamp: span.end_timestamp } : {}),
    status: span.status,
    is_segment: span.is_segment,
    attributes: {
      "sentry.op": safeOperation,
      "sentry.origin": "auto",
      "sentry.environment": "production",
      "sentry.segment.name.source": "route",
      ...(release ? { "sentry.release": `here-hugo@${release}` } : {}),
      application,
    },
  };
}
