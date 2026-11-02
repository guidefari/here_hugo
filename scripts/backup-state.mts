import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

import { StoredStateStoreCredentials } from "alchemy/Cloudflare/StateStore";
import { encodeState, REDACTED_MARKER } from "alchemy/State/StateEncoding";
import { StateStoreError } from "alchemy/State/State";
import { Effect, Exit, Schema } from "effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";

import {
  connectExistingStateStore,
  stateStoreUrl,
} from "../infra/state-store.ts";

const credentialsPath = process.argv[2];
if (!credentialsPath)
  throw new Error(
    "Usage: bun run state:backup <private-state-store-credentials.json>",
  );
let input: unknown;
try {
  input = JSON.parse(await readFile(credentialsPath, "utf8"));
} catch {
  throw new Error("Cannot read state store credentials JSON");
}
const decoded = Schema.decodeUnknownExit(StoredStateStoreCredentials)(input);
if (Exit.isFailure(decoded))
  throw new Error("State store credentials file is invalid");
const credentials = decoded.value;
if (credentials.url !== stateStoreUrl)
  throw new Error("Refusing to back up a different state store");

const result = await Effect.runPromiseExit(
  Effect.gen(function* () {
    const state = yield* connectExistingStateStore(credentials);
    const scopes = [
      { stack: "here-hugo", stage: "prod" },
      { stack: "CloudflareStateStore", stage: "alchemy-state-store" },
    ];
    const stacks = [];
    for (const scope of scopes) {
      const resources = [];
      for (const fqn of yield* state.list(scope)) {
        const value = yield* state.get({ ...scope, fqn });
        if (!value)
          return yield* Effect.fail(
            new StateStoreError({ message: "State changed during backup" }),
          );
        resources.push({ fqn, value });
      }
      if (scope.stack === "CloudflareStateStore") {
        const key = resources.find(
          (resource) => resource.fqn === "StateStoreEncryptionKeyValue",
        );
        yield* Schema.decodeUnknownEffect(
          Schema.Struct({
            attr: Schema.Struct({
              text: Schema.Struct({
                [REDACTED_MARKER]: Schema.String.check(
                  Schema.isPattern(/^[a-f0-9]{64}$/i),
                ),
              }),
            }),
          }),
        )(encodeState(key?.value));
      }
      stacks.push({
        ...scope,
        resources,
        output: yield* state.getOutput(scope),
      });
    }
    return encodeState({
      capturedAt: new Date().toISOString(),
      url: stateStoreUrl,
      stacks,
    });
  }).pipe(Effect.provide(FetchHttpClient.layer)),
);
if (Exit.isFailure(result))
  throw new Error(
    "State or bootstrap-key backup failed. No snapshot was published.",
  );
const snapshot = result.value;

const directory = join(
  homedir(),
  ".alchemy",
  "recovery",
  `${new Date().toISOString().replaceAll(":", "-")}-here-hugo-snapshot`,
);
await mkdir(directory, { mode: 0o700 });
const filename = join(directory, "state.json");
const text = JSON.stringify(snapshot);
await writeFile(filename, text, { mode: 0o600, flag: "wx" });
const expected = new Bun.CryptoHasher("sha256").update(text).digest("hex");
const actual = new Bun.CryptoHasher("sha256")
  .update(await readFile(filename))
  .digest("hex");
if (expected !== actual)
  throw new Error("Private snapshot read-back verification failed");
await writeFile(join(directory, "sha256.txt"), expected + "\n", {
  mode: 0o600,
  flag: "wx",
});
console.log(
  "Verified private state and bootstrap-key snapshot saved. Keep a separate protected copy of this directory.",
);
