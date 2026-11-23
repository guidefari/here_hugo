import {
  browserApiErrorsIntegration, browserTracingIntegration, captureException,
  dedupeIntegration, eventFiltersIntegration, functionToStringIntegration,
  getClient, globalHandlersIntegration, init,
} from "@sentry/browser";
import type { BrowserOptions } from "@sentry/browser";
import { routeName, scrubError, scrubSpan } from "./privacy";
import type { Application } from "./privacy";

export const sentryDsn = "https://e9cb49293fe5d0796c9d56714d4c6789@o452087.ingest.us.sentry.io/4512478131781632";

export function browserOptions(application: Application, release?: string): BrowserOptions {
  return {
    dsn: sentryDsn,
    environment: "production",
    ...(release ? { release: `here-hugo@${release}` } : {}),
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      graphQL: { document: false, variables: false },
      genAI: { inputs: false, outputs: false },
      mcp: { inputs: false, outputs: false },
      databaseQueryData: false,
      queues: false,
      stackFrameVariables: false,
      frameContextLines: 0,
    },
    sendClientReports: false,
    maxBreadcrumbs: 0,
    tracesSampleRate: 0.1,
    tracePropagationTargets: [],
    defaultIntegrations: false,
    integrations: [
      eventFiltersIntegration(),
      functionToStringIntegration(),
      browserApiErrorsIntegration(),
      globalHandlersIntegration(),
      dedupeIntegration(),
      browserTracingIntegration({
        traceFetch: false,
        traceXHR: false,
        beforeStartSpan: (options) => ({
          ...options,
          name: routeName(application, options.name ?? "/"),
          attributes: { "sentry.op": options.op ?? "navigation", "sentry.segment.name.source": "route" },
        }),
      }),
    ],
    beforeSend: (event) => scrubError(event, application),
    beforeSendSpan: (span) => scrubSpan(span, application, release),
    beforeBreadcrumb: () => null,
  };
}

export function initializeTelemetry(application: Application) {
  if (!import.meta.env.PROD || getClient()) return;
  init(browserOptions(application, import.meta.env.VITE_APP_VERSION));
}

export function reportCrash(error: Error) {
  if (getClient()) captureException(error);
}
