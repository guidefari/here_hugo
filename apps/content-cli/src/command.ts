import { Clock, Effect, Path, Schema } from "effect";
import type { FileSystem } from "effect/FileSystem";

import type { ContentRoots } from "./config.ts";
import { parseContentPath } from "./content-path.ts";
import { writeNewContent } from "./content-writer.ts";
import type { ContentCreationError } from "./errors.ts";
import { InvalidContentPath } from "./errors.ts";
import { renderArchetype } from "./archetype.ts";

const CommandArguments = Schema.Tuple([Schema.String]);

/** Parses arguments and creates one note from the fixed note template. */
export const createContent = (
  arguments_: ReadonlyArray<string>,
  roots: ContentRoots,
): Effect.Effect<
  string,
  ContentCreationError,
  Path.Path | FileSystem
> =>
  Schema.decodeUnknownEffect(CommandArguments)(arguments_).pipe(
    Effect.mapError(
      () => new InvalidContentPath({ reason: "Usage: bun run content:new <note-path>" }),
    ),
    Effect.flatMap(([rawPath]) => parseContentPath(rawPath, roots.contentRoot, roots.archetypes)),
    Effect.flatMap((contentPath) =>
      Clock.currentTimeMillis.pipe(
        Effect.map((milliseconds) => new Date(milliseconds)),
        Effect.flatMap((now) => renderArchetype(roots.archetypes[contentPath.kind], contentPath, now)),
        Effect.flatMap((renderedContent) => writeNewContent(contentPath, renderedContent)),
        Effect.as(contentPath.relativePath),
      ),
    ),
  );
