import { BunServices } from "@effect/platform-bun";
import { Effect, Path } from "effect";

import { lintContentTags, type ContentFinding } from "./tag-lint.ts";

export const formatFinding = (finding: ContentFinding): string =>
  finding.kind === "unknown-tag"
    ? `${finding.relativePath}: unknown tag ${JSON.stringify(finding.tag)}`
    : `${finding.relativePath}: ${finding.kind}: ${finding.reason}`;

const program = Effect.gen(function* () {
  const path = yield* Path.Path;
  const root = yield* path.fromFileUrl(new URL("../../../", import.meta.url)).pipe(Effect.orDie);
  return yield* lintContentTags(root);
}).pipe(Effect.provide(BunServices.layer));

if (import.meta.main) {
  const outcome = await Effect.runPromise(Effect.match(program, {
    onFailure: (error) => ({ _tag: "Failure" as const, error }),
    onSuccess: (report) => ({ _tag: "Success" as const, report }),
  }));
  if (outcome._tag === "Failure") {
    const error = outcome.error;
    console.error(error._tag === "ContentScanFailed"
      ? `Could not ${error.operation} content at ${error.path}.`
      : `Invalid tag lint configuration: ${error.reason}`);
    process.exitCode = 1;
  } else if (outcome.report.findings.length > 0) {
    for (const finding of outcome.report.findings) console.error(formatFinding(finding));
    console.error(`${outcome.report.findings.length} finding(s) in ${outcome.report.filesChecked} Markdown files.`);
    process.exitCode = 1;
  } else {
    console.log(`Checked ${outcome.report.filesChecked} Markdown files: no tag findings.`);
  }
}
