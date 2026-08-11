import { Effect, FileSystem, Path } from "effect";

import type { ContentPath } from "./content-path.ts";
import { ContentAlreadyExists, ContentFilesystemError } from "./errors.ts";

/** Creates a rendered note once, without replacing any existing destination. */
export const writeNewContent = (
  contentPath: ContentPath,
  renderedContent: string,
): Effect.Effect<
  void,
  ContentAlreadyExists | ContentFilesystemError,
  FileSystem.FileSystem | Path.Path
> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const parentDirectory = path.dirname(contentPath.outputPath);

    yield* fs.makeDirectory(parentDirectory, { recursive: true }).pipe(
      Effect.mapError(
        () => new ContentFilesystemError({ operation: "create-directory", path: contentPath.relativePath }),
      ),
    );

    yield* Effect.scoped(
      Effect.gen(function* () {
        const file = yield* fs.open(contentPath.outputPath, { flag: "wx" }).pipe(
          Effect.mapError((error) =>
            error.reason._tag === "AlreadyExists"
              ? new ContentAlreadyExists({ path: contentPath.relativePath })
              : new ContentFilesystemError({ operation: "write-content", path: contentPath.relativePath }),
          ),
        );
        yield* file.writeAll(new TextEncoder().encode(renderedContent)).pipe(
          Effect.mapError(
            () => new ContentFilesystemError({ operation: "write-content", path: contentPath.relativePath }),
          ),
        );
      }),
    );
  });
