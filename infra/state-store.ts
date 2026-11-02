import { currentProfileName } from "alchemy/Auth/Profile";
import { CloudflareApiLive } from "alchemy/Cloudflare";
import {
  STATE_STORE_VERSION,
  loginWithCloudflare,
} from "alchemy/Cloudflare/StateStore";
import {
  makeHttpStateStore,
  type HttpStateStoreCredentials,
} from "alchemy/State/HttpStateStore";
import { State, StateStoreError } from "alchemy/State/State";
import { Effect, Layer } from "effect";

export const stateStoreUrl = "https://alchemy-state-store.guideg6.workers.dev";

export const connectExistingStateStore = (
  credentials: HttpStateStoreCredentials,
) =>
  Effect.gen(function* () {
    const state = yield* makeHttpStateStore({
      ...credentials,
      id: "existing-cloudflare-http",
    });
    const version = yield* state.getVersion();
    if (version !== STATE_STORE_VERSION) {
      return yield* Effect.fail(
        new StateStoreError({
          message:
            "State store version differs. This repository cannot bootstrap or upgrade the shared store.",
        }),
      );
    }
    const stacks = yield* state.listStacks();
    if (!stacks.includes("here-hugo")) {
      return yield* Effect.fail(
        new StateStoreError({
          message:
            "Existing here-hugo state is missing. Refusing to initialize it.",
        }),
      );
    }
    const scope = { stack: "here-hugo", stage: "prod" };
    const resources = yield* state.list(scope);
    if (resources.length === 0) {
      return yield* Effect.fail(
        new StateStoreError({
          message:
            "Production state is empty. Recovery is required before deployment.",
        }),
      );
    }
    for (const fqn of resources) {
      const resource = yield* state.get({ ...scope, fqn });
      if (!resource) {
        return yield* Effect.fail(
          new StateStoreError({
            message:
              "A production state record disappeared. Refusing to deploy.",
          }),
        );
      }
    }
    if ((yield* state.getOutput(scope)) === undefined) {
      return yield* Effect.fail(
        new StateStoreError({
          message:
            "Production output is missing. Recovery is required before deployment.",
        }),
      );
    }
    return state;
  });

const authenticate = Effect.gen(function* () {
  const profile = yield* currentProfileName;
  const credentials = yield* loginWithCloudflare(profile, false);
  if (credentials.url !== stateStoreUrl) {
    return yield* Effect.fail(
      new StateStoreError({
        message:
          "State store endpoint differs from this repository's existing store.",
      }),
    );
  }
  return yield* connectExistingStateStore(credentials);
});

export const existingStateStore = Layer.effect(
  State,
  Effect.gen(function* () {
    const context =
      yield* Effect.context<Effect.Services<typeof authenticate>>();
    return yield* Effect.cached(
      authenticate.pipe(Effect.provideContext(context), Effect.orDie),
    );
  }),
).pipe(Layer.provide(CloudflareApiLive()), Layer.orDie);
