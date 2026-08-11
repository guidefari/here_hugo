import { Effect, FileSystem, Path, Schema } from "effect";

import { InvalidContentCliConfig } from "./errors.ts";

const archetypeKinds = [
  "album",
  "artist",
  "bliki",
  "book",
  "docker-presentation",
  "media",
  "mix",
  "note",
  "playlist",
  "read",
  "resource",
  "til",
  "track",
] as const;

export type ArchetypeKind = (typeof archetypeKinds)[number];

/** Repository-layout facts supplied by content-cli.config.json. */
export type ContentRoots = {
  readonly contentRoot: string;
  readonly archetypes: Readonly<Record<ArchetypeKind, string>>;
};

const ArchetypePaths = Schema.Struct({
  album: Schema.NonEmptyString,
  artist: Schema.NonEmptyString,
  bliki: Schema.NonEmptyString,
  book: Schema.NonEmptyString,
  "docker-presentation": Schema.NonEmptyString,
  media: Schema.NonEmptyString,
  mix: Schema.NonEmptyString,
  note: Schema.NonEmptyString,
  playlist: Schema.NonEmptyString,
  read: Schema.NonEmptyString,
  resource: Schema.NonEmptyString,
  til: Schema.NonEmptyString,
  track: Schema.NonEmptyString,
});

const ContentCliConfig = Schema.Struct({
  contentRoot: Schema.NonEmptyString,
  archetypes: ArchetypePaths,
});

/** Reads and validates the repository-local content CLI configuration. */
export const loadContentRoots = (
  repositoryRoot: string,
): Effect.Effect<ContentRoots, InvalidContentCliConfig, FileSystem.FileSystem | Path.Path> =>
  Effect.gen(function* () {
    const path = yield* Path.Path;
    const fs = yield* FileSystem.FileSystem;
    const configPath = path.join(repositoryRoot, "content-cli.config.json");
    const serialized = yield* fs.readFileString(configPath).pipe(
      Effect.mapError(() => new InvalidContentCliConfig({ reason: "Could not read content-cli.config.json." })),
    );
    const raw = yield* Effect.try({
      try: () => JSON.parse(serialized) as unknown,
      catch: () => new InvalidContentCliConfig({ reason: "content-cli.config.json must contain JSON." }),
    });
    const config = yield* Schema.decodeUnknownEffect(ContentCliConfig)(raw).pipe(
      Effect.mapError(() => new InvalidContentCliConfig({ reason: "content-cli.config.json has an invalid shape." })),
    );

    const archetypes = {} as Record<ArchetypeKind, string>;
    for (const kind of archetypeKinds) {
      archetypes[kind] = yield* resolveRepositoryPath(repositoryRoot, config.archetypes[kind], `archetypes.${kind}`);
    }

    return {
      contentRoot: yield* resolveRepositoryPath(repositoryRoot, config.contentRoot, "contentRoot"),
      archetypes,
    };
  });

const resolveRepositoryPath = (
  repositoryRoot: string,
  configuredPath: string,
  field: string,
): Effect.Effect<string, InvalidContentCliConfig, Path.Path> =>
  Effect.gen(function* () {
    const path = yield* Path.Path;
    if (path.isAbsolute(configuredPath)) {
      return yield* Effect.fail(new InvalidContentCliConfig({ reason: `${field} must be repository-relative.` }));
    }

    const resolvedPath = path.resolve(repositoryRoot, configuredPath);
    const relativePath = path.relative(repositoryRoot, resolvedPath);
    if (relativePath === "" || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
      return yield* Effect.fail(new InvalidContentCliConfig({ reason: `${field} resolves outside the repository.` }));
    }

    return resolvedPath;
  });
