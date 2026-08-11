import { Effect, Path, Schema } from "effect";

import type { ArchetypeKind } from "./config.ts";
import { ArchetypeNotConfigured, InvalidContentPath } from "./errors.ts";

/** A validated content destination relative to the Astro content directory. */
export type ContentPath = {
  readonly kind: ArchetypeKind;
  readonly relativePath: string;
  readonly outputPath: string;
  readonly title: string;
};

/** Parses one CLI positional argument into a safe, archetyped content destination. */
export const parseContentPath = (
  rawPath: unknown,
  contentRoot: string,
  archetypes: Readonly<Record<string, string>>,
): Effect.Effect<ContentPath, InvalidContentPath | ArchetypeNotConfigured, Path.Path> =>
  Schema.decodeUnknownEffect(Schema.NonEmptyString)(rawPath).pipe(
    Effect.mapError(() => new InvalidContentPath({ reason: "Expected one non-empty content path." })),
    Effect.flatMap((pathValue) =>
      Effect.gen(function* () {
        const path = yield* Path.Path;
        const invalid = (reason: string) => Effect.fail(new InvalidContentPath({ reason }));

        if (path.isAbsolute(pathValue) || pathValue.includes("\\")) {
          return yield* invalid("Content paths must be relative slash-separated paths.");
        }

        const segments = pathValue.split("/");
        if (segments.some((segment) => segment.length === 0 || segment === "." || segment === "..")) {
          return yield* invalid("Content paths cannot contain empty, dot, or traversal segments.");
        }
        if (segments.length < 2) {
          return yield* invalid("Content paths must include a configured section and filename.");
        }

        const kind = segments[0];
        if (kind === undefined || !(kind in archetypes)) {
          return yield* Effect.fail(new ArchetypeNotConfigured({ kind: kind ?? "" }));
        }

        const filename = segments.at(-1);
        if (filename === undefined) {
          return yield* invalid("Content paths must end with a filename.");
        }

        const extension = path.extname(filename);
        if (extension !== "" && extension !== ".md") {
          return yield* invalid("Content paths may use only the .md extension.");
        }

        const normalizedFilename = extension === ".md" ? filename : `${filename}.md`;
        const stem = normalizedFilename.slice(0, -3);
        if (stem.length === 0) {
          return yield* invalid("Content paths must end with a non-empty filename.");
        }

        const relativePath = [...segments.slice(0, -1), normalizedFilename].join("/");
        const outputPath = path.resolve(contentRoot, relativePath);
        const resolvedRelativePath = path.relative(contentRoot, outputPath);
        if (
          resolvedRelativePath === "" ||
          resolvedRelativePath === ".." ||
          resolvedRelativePath.startsWith(`..${path.sep}`) ||
          path.isAbsolute(resolvedRelativePath)
        ) {
          return yield* invalid("Content path resolves outside the content root.");
        }

        const title = titleFromStem(stem);
        if (title.length === 0) {
          return yield* invalid("Content paths must produce a non-empty title.");
        }

        return { kind: kind as ArchetypeKind, relativePath, outputPath, title };
      }),
    ),
  );

/** Derives a readable title from a validated Markdown filename stem. */
export const titleFromStem = (stem: string): string =>
  stem
    .replaceAll(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => `${word.slice(0, 1).toLocaleUpperCase()}${word.slice(1).toLocaleLowerCase()}`)
    .join(" ");
