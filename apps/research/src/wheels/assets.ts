import { Option, Record, Schema } from "effect";
import manifest from "./assets.json";

const Asset = Schema.Struct({
  url: Schema.String,
  sha256: Schema.String,
  bytes: Schema.Number,
  contentType: Schema.String,
});
const assets = Schema.decodeUnknownSync(Schema.Record(Schema.String, Asset))(manifest);

export function wheelAsset(path: string): string {
  return Option.getOrThrow(Record.get(assets, path)).url;
}
