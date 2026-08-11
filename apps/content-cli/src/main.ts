import { BunServices } from "@effect/platform-bun";
import { Effect, Path } from "effect";

import { createContent } from "./command.ts";
import { loadContentRoots } from "./config.ts";
import type { ContentCreationError } from "./errors.ts";

const program = Effect.gen(function* () {
  const path = yield* Path.Path;
  const repositoryRoot = yield* path.fromFileUrl(new URL("../../../", import.meta.url)).pipe(Effect.orDie);

  const roots = yield* loadContentRoots(repositoryRoot);
  return yield* createContent(Bun.argv.slice(2), roots);
}).pipe(Effect.provide(BunServices.layer));

const outcome = await Effect.runPromise(
  Effect.match(program, {
    onFailure: (error: ContentCreationError) => ({ _tag: "Failure" as const, error }),
    onSuccess: (relativePath) => ({ _tag: "Success" as const, relativePath }),
  }),
);

if (outcome._tag === "Success") {
  console.log(outcome.relativePath);
} else {
  console.error(formatError(outcome.error));
  process.exitCode = exitCodeFor(outcome.error);
}

/** Renders a safe diagnostic for an expected command failure. */
function formatError(error: ContentCreationError): string {
  switch (error._tag) {
    case "InvalidContentCliConfig":
      return `Invalid content CLI configuration: ${error.reason}`;
    case "InvalidContentPath":
      return `Invalid content path: ${error.reason}`;
    case "ArchetypeNotConfigured":
      return `No archetype is configured for section: ${error.kind}`;
    case "ArchetypeNotFound":
      return `Archetype not found: ${error.path}`;
    case "InvalidArchetype":
      return `Invalid archetype: ${error.reason}`;
    case "ContentAlreadyExists":
      return `Content already exists: ${error.path}`;
    case "ContentFilesystemError":
      return `Could not ${error.operation}: ${error.path}`;
  }
}

/** Maps expected command failures to the documented process exit codes. */
function exitCodeFor(error: ContentCreationError): 1 | 2 {
  return error._tag === "InvalidContentPath" ? 2 : 1;
}
