import { expect, it } from "@effect/vitest";
import { Effect } from "effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";

import { connectExistingStateStore } from "./state-store.ts";

const scope = "/state/stacks/here-hugo/stages/prod";
const resource = {
  status: "created",
  fqn: "Site/Worker",
  logicalId: "Worker",
  instanceId: "retained",
  resourceType: "Cloudflare.Worker",
  providerVersion: 0,
  providerMode: "live",
  downstream: [],
  bindings: [],
  props: { name: "existing-worker" },
  attr: { workerId: "physical-id" },
};

const withStore = <A, E, R>(
  overrides: Readonly<
    Record<
      string,
      | {
          readonly status?: number;
          readonly value?: unknown;
          readonly text?: string;
        }
      | undefined
    >
  >,
  use: (
    url: string,
    requests: { method: string; path: string }[],
  ) => Effect.Effect<A, E, R>,
) =>
  Effect.acquireUseRelease(
    Effect.sync(() => {
      const requests: { method: string; path: string }[] = [];
      const defaults: Readonly<Record<string, unknown>> = {
        "/version": { version: 7 },
        "/state/stacks": ["here-hugo"],
        [`${scope}/resources`]: ["Site/Worker"],
        [`${scope}/resources/Site%2FWorker`]: resource,
        [`${scope}/output`]: { url: "https://example.test" },
      };
      const server = Bun.serve({
        hostname: "127.0.0.1",
        port: 0,
        fetch(request) {
          const path = decodeURIComponent(new URL(request.url).pathname);
          requests.push({ method: request.method, path });
          if (request.method !== "GET")
            return new Response(null, { status: 405 });
          if (request.headers.get("authorization") !== "Bearer test-token")
            return new Response(null, { status: 401 });
          const override = overrides[path];
          if (override?.text !== undefined)
            return new Response(override.text, {
              status: override.status ?? 200,
            });
          return Response.json(
            override ? (override.value ?? null) : (defaults[path] ?? null),
            { status: override?.status ?? 200 },
          );
        },
      });
      return { server, requests };
    }),
    ({ server, requests }) =>
      use(server.url.href, requests).pipe(
        Effect.provide(FetchHttpClient.layer),
      ),
    ({ server }) => Effect.sync(() => server.stop(true)),
  );

it.live("connects to readable existing state without changing it", () =>
  withStore({}, (url, requests) =>
    Effect.gen(function* () {
      const state = yield* connectExistingStateStore({
        url,
        authToken: "test-token",
      });
      expect(
        yield* state.get({
          stack: "here-hugo",
          stage: "prod",
          fqn: "Site/Worker",
        }),
      ).toEqual(resource);
      expect(requests.every((request) => request.method === "GET")).toBe(true);
    }),
  ),
);

for (const status of [401, 403, 404, 500]) {
  it.live(`fails closed when the existing store returns HTTP ${status}`, () =>
    withStore(
      {
        "/version": { status },
      },
      (url, requests) =>
        Effect.gen(function* () {
          const error = yield* Effect.flip(
            connectExistingStateStore({ url, authToken: "test-token" }),
          );
          expect(error._tag).toBe("StateStoreError");
          expect(requests.length).toBeGreaterThan(0);
          expect(
            requests.every(
              (request) =>
                request.method === "GET" && request.path === "/version",
            ),
          ).toBe(true);
        }),
    ),
  );
}

for (const [label, overrides] of Object.entries({
  "unknown version": { "/version": { text: "invalid JSON" } },
  "older version": { "/version": { value: { version: 6 } } },
  "newer version": { "/version": { value: { version: 8 } } },
  "rejected bearer token": { "/state/stacks": { status: 401 } },
  "missing stack": { "/state/stacks": { value: ["another-stack"] } },
  "empty production state": { [`${scope}/resources`]: { value: [] } },
  "undecodable resource": {
    [`${scope}/resources/Site%2FWorker`]: { status: 500 },
  },
  "disappeared resource": {
    [`${scope}/resources/Site%2FWorker`]: { value: null },
  },
  "missing output": { [`${scope}/output`]: { value: null } },
})) {
  it.live(`does not initialize or upgrade state after ${label}`, () =>
    withStore(overrides, (url, requests) =>
      Effect.gen(function* () {
        const error = yield* Effect.flip(
          connectExistingStateStore({ url, authToken: "test-token" }),
        );
        expect(error._tag).toBe("StateStoreError");
        expect(requests.every((request) => request.method === "GET")).toBe(
          true,
        );
      }),
    ),
  );
}
