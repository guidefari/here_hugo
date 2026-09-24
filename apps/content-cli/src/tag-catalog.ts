import { Effect, FileSystem, Path, Schema } from "effect";

export class InvalidTagCatalog extends Schema.TaggedError<InvalidTagCatalog>()(
  "InvalidTagCatalog",
  { reason: Schema.String },
) {}

const TagCatalog = Schema.Struct({
  allowedTags: Schema.NonEmptyArray(Schema.NonEmptyString),
});

export type AllowedTags = ReadonlySet<string>;

export const parseAllowedTags = Effect.fn("parseAllowedTags")(function* (input: unknown): Effect.fn.Return<AllowedTags, InvalidTagCatalog> {
  const catalog = yield* Schema.decodeUnknownEffect(TagCatalog)(input).pipe(
    Effect.mapError(() => new InvalidTagCatalog({ reason: "content-tags.json must contain a nonempty allowedTags array of nonempty strings." })),
  );
  const allowed = new Set(catalog.allowedTags);
  if (allowed.size !== catalog.allowedTags.length) {
    return yield* new InvalidTagCatalog({ reason: "content-tags.json contains duplicate tags." });
  }
  return allowed;
});

export const loadAllowedTags = Effect.fn("loadAllowedTags")(function* (repositoryRoot: string): Effect.fn.Return<AllowedTags, InvalidTagCatalog, FileSystem.FileSystem | Path.Path> {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const serialized = yield* fs.readFileString(path.join(repositoryRoot, "content-tags.json")).pipe(
    Effect.mapError(() => new InvalidTagCatalog({ reason: "Could not read content-tags.json." })),
  );
  const input = yield* Effect.try({
    try: (): unknown => JSON.parse(serialized),
    catch: () => new InvalidTagCatalog({ reason: "content-tags.json must contain JSON." }),
  });
  return yield* parseAllowedTags(input);
});
