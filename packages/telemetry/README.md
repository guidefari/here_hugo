# Browser telemetry

Shared Sentry setup for the blog, research reader, and GPU playground.
The public DSN points at `goosebumps-collective/here-hugo`; it is not an API token.
No secret ingestion token is shipped to browsers.

Production builds capture browser exceptions and sample 10% of page-load and
navigation traces. Development is disabled. `VITE_APP_VERSION` supplies the Git
revision as a release. Each event is tagged `application=blog|research|gpu`.

The SDK's streamed-span hook and error hook project an allowlist before export.
Error messages, user data, request data, breadcrumbs, arbitrary context, frame
variables, URL queries, and original span attributes are not exported. Stack
filenames, functions, and line/column positions remain for diagnosis. Route names
are bounded templates, not report names or query strings.

Browser builds publish source maps so Sentry can resolve minified stack frames.
This is intentional for this public-source repository. Only approved reports enter
the research bundle or its source map; drafts remain excluded.

There is no session replay, console-log capture, outgoing HTTP tracing, trace
header propagation, or independent OTEL exporter. Cloudflare Worker logs remain
owned by the existing infrastructure configuration.

Run `bun run test` and `bun run typecheck` here. Tests capture actual SDK envelopes
at the transport seam and check synthetic sensitive values are absent. Production
verification must also retrieve a known error and trace from Sentry.
