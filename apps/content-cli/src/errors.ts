import { Schema } from "effect";

/** The repository content-CLI configuration cannot be read or parsed safely. */
export class InvalidContentCliConfig extends Schema.TaggedError<InvalidContentCliConfig>()(
  "InvalidContentCliConfig",
  { reason: Schema.String },
) {}

/** A command path that cannot safely name content within the content root. */
export class InvalidContentPath extends Schema.TaggedError<InvalidContentPath>()(
  "InvalidContentPath",
  { reason: Schema.String },
) {}

/** No configured archetype corresponds to the path's content section. */
export class ArchetypeNotConfigured extends Schema.TaggedError<ArchetypeNotConfigured>()(
  "ArchetypeNotConfigured",
  { kind: Schema.String },
) {}

/** A configured archetype file is absent. */
export class ArchetypeNotFound extends Schema.TaggedError<ArchetypeNotFound>()(
  "ArchetypeNotFound",
  { path: Schema.String },
) {}

/** A configured archetype contains unsupported template syntax. */
export class InvalidArchetype extends Schema.TaggedError<InvalidArchetype>()(
  "InvalidArchetype",
  { reason: Schema.String },
) {}

/** The requested content already exists and was left unchanged. */
export class ContentAlreadyExists extends Schema.TaggedError<ContentAlreadyExists>()(
  "ContentAlreadyExists",
  { path: Schema.String },
) {}

/** A filesystem operation failed without exposing its raw platform exception. */
export class ContentFilesystemError extends Schema.TaggedError<ContentFilesystemError>()(
  "ContentFilesystemError",
  {
    operation: Schema.Literals(["read-archetype", "create-directory", "write-content"]),
    path: Schema.String,
  },
) {}

/** The complete set of expected content-creation command failures. */
export type ContentCreationError =
  | InvalidContentCliConfig
  | InvalidContentPath
  | ArchetypeNotConfigured
  | ArchetypeNotFound
  | InvalidArchetype
  | ContentAlreadyExists
  | ContentFilesystemError;
