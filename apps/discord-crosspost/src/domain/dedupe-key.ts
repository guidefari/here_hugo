import * as Schema from "effect/Schema";

export const DedupeKey = Schema.String.pipe(Schema.brand("DedupeKey"));
export type DedupeKey = Schema.Schema.Type<typeof DedupeKey>;

export const make = (sourceId: string, entryIdentity: string): DedupeKey =>
  DedupeKey.make(`${encodeURIComponent(sourceId)}:${encodeURIComponent(entryIdentity)}`);
