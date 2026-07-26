import { XMLParser } from "fast-xml-parser";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import type { FeedSource } from "./feed-source";
import { MediaEntryRejected } from "./errors";
import { MediaEntry } from "./media-entry";

const OptionalString = Schema.optionalKey(Schema.String);
const OptionalStrings = Schema.optionalKey(Schema.Array(Schema.String));
const XmlText = Schema.Union([
  Schema.String,
  Schema.Struct({ "#text": Schema.String }),
]);
const OptionalXmlText = Schema.optionalKey(XmlText);

export const JsonFeedEntry = Schema.Struct({
  id: Schema.NonEmptyString,
  url: Schema.NonEmptyString,
  title: Schema.NonEmptyString,
  summary: OptionalString,
  content_text: OptionalString,
  date_published: Schema.NonEmptyString,
  authors: Schema.optionalKey(Schema.Array(Schema.Struct({ name: Schema.String }))),
  tags: OptionalStrings,
  _here: Schema.optionalKey(Schema.Struct({
    media_type: OptionalString,
    media_url: OptionalString,
    thumbnail_url: OptionalString,
    draft: Schema.optionalKey(Schema.Boolean),
  })),
});

const JsonFeed = Schema.Struct({
  version: Schema.String,
  items: Schema.Array(Schema.Unknown),
});

export const RssItem = Schema.Struct({
  title: XmlText,
  link: XmlText,
  guid: OptionalXmlText,
  description: OptionalXmlText,
  pubDate: XmlText,
  creator: OptionalXmlText,
  category: Schema.optionalKey(Schema.Array(XmlText)),
  enclosure: Schema.optionalKey(Schema.Struct({
    "@_url": OptionalString,
    "@_type": OptionalString,
  })),
});

const RssFeed = Schema.Struct({
  rss: Schema.Struct({ channel: Schema.Struct({ item: Schema.Array(Schema.Unknown) }) }),
});

const AtomLink = Schema.Struct({
  "@_href": Schema.String,
  "@_rel": OptionalString,
  "@_type": OptionalString,
});

export const AtomEntry = Schema.Struct({
  id: XmlText,
  title: XmlText,
  link: Schema.Array(AtomLink),
  summary: OptionalXmlText,
  content: OptionalXmlText,
  published: OptionalXmlText,
  updated: XmlText,
  author: Schema.optionalKey(Schema.Struct({ name: XmlText })),
  category: Schema.optionalKey(Schema.Array(Schema.Struct({ "@_term": Schema.String }))),
});

const AtomFeed = Schema.Struct({
  feed: Schema.Struct({ entry: Schema.Array(Schema.Unknown) }),
});

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  parseTagValue: false,
  parseAttributeValue: false,
  jPath: true,
  isArray: (_name, path) =>
    typeof path === "string" && (
      path.endsWith("channel.item") ||
      path.endsWith("feed.entry") ||
      path.endsWith("entry.link") ||
      path.endsWith("entry.category") ||
      path.endsWith("item.category")
    ),
});

const rejection = (source: FeedSource, raw: unknown, error: unknown): MediaEntryRejected =>
  new MediaEntryRejected({
    sourceId: source.id,
    rawPayload: safeStringify(raw),
    decodeError: String(error),
  });

const safeStringify = (value: unknown): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return "[unserializable feed entry]";
  }
};

const validDate = (value: string): boolean => !Number.isNaN(Date.parse(value));
const validUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const decodeMediaEntry = (
  source: FeedSource,
  raw: unknown,
  candidate: unknown,
): Result.Result<MediaEntry, MediaEntryRejected> => {
  const decoded = Schema.decodeUnknownResult(MediaEntry)(candidate);
  if (Result.isFailure(decoded)) return Result.fail(rejection(source, raw, decoded.failure));
  if (!validUrl(decoded.success.entryUrl) || !validDate(decoded.success.publishedAt)) {
    return Result.fail(rejection(source, raw, "entry URL or publication date is invalid"));
  }
  if (decoded.success.mediaUrl && !validUrl(decoded.success.mediaUrl)) {
    return Result.fail(rejection(source, raw, "media URL is invalid"));
  }
  if (decoded.success.thumbnailUrl && !validUrl(decoded.success.thumbnailUrl)) {
    return Result.fail(rejection(source, raw, "thumbnail URL is invalid"));
  }
  return Result.succeed(decoded.success);
};

const decodeEntries = <A>(
  source: FeedSource,
  values: ReadonlyArray<unknown>,
  decode: (input: unknown) => Result.Result<A, unknown>,
  normalize: (entry: A) => unknown,
): ReadonlyArray<Result.Result<MediaEntry, MediaEntryRejected>> =>
  values.map((raw) => {
    const decoded = decode(raw);
    if (Result.isFailure(decoded)) return Result.fail(rejection(source, raw, decoded.failure));
    return decodeMediaEntry(source, raw, normalize(decoded.success));
  });

const parseJson = (body: string): unknown => JSON.parse(body);
const parseXml = (body: string): unknown => xmlParser.parse(body);
const xmlText = (value: Schema.Schema.Type<typeof XmlText>): string =>
  typeof value === "string" ? value : value["#text"];

export const decodeJsonFeed = (
  source: FeedSource,
  body: string,
): ReadonlyArray<Result.Result<MediaEntry, MediaEntryRejected>> => {
  const feed = Schema.decodeUnknownSync(JsonFeed)(parseJson(body));
  return decodeEntries(source, feed.items, Schema.decodeUnknownResult(JsonFeedEntry), (entry) => ({
    sourceId: source.id,
    entryIdentity: entry.id,
    title: entry.title,
    entryUrl: entry.url,
    description: entry.summary ?? entry.content_text ?? "",
    creator: entry.authors?.[0]?.name ?? "",
    mediaType: entry._here?.media_type ?? "",
    mediaUrl: entry._here?.media_url ?? "",
    tags: entry.tags ?? [],
    thumbnailUrl: entry._here?.thumbnail_url ?? "",
    publishedAt: entry.date_published,
    draft: entry._here?.draft ?? false,
  }));
};

export const decodeRss = (
  source: FeedSource,
  body: string,
): ReadonlyArray<Result.Result<MediaEntry, MediaEntryRejected>> => {
  const feed = Schema.decodeUnknownSync(RssFeed)(parseXml(body));
  return decodeEntries(source, feed.rss.channel.item, Schema.decodeUnknownResult(RssItem), (entry) => ({
    sourceId: source.id,
    entryIdentity: entry.guid ? xmlText(entry.guid) : xmlText(entry.link),
    title: xmlText(entry.title),
    entryUrl: xmlText(entry.link),
    description: entry.description ? xmlText(entry.description) : "",
    creator: entry.creator ? xmlText(entry.creator) : "",
    mediaType: entry.enclosure?.["@_type"] ?? "",
    mediaUrl: entry.enclosure?.["@_url"] ?? "",
    tags: entry.category?.map(xmlText) ?? [],
    thumbnailUrl: "",
    publishedAt: normalizeDate(xmlText(entry.pubDate)),
    draft: false,
  }));
};

export const decodeAtom = (
  source: FeedSource,
  body: string,
): ReadonlyArray<Result.Result<MediaEntry, MediaEntryRejected>> => {
  const feed = Schema.decodeUnknownSync(AtomFeed)(parseXml(body));
  return decodeEntries(source, feed.feed.entry, Schema.decodeUnknownResult(AtomEntry), (entry) => {
    const alternate = entry.link.find((link) => !link["@_rel"] || link["@_rel"] === "alternate");
    const enclosure = entry.link.find((link) => link["@_rel"] === "enclosure");
    return {
      sourceId: source.id,
      entryIdentity: xmlText(entry.id),
      title: xmlText(entry.title),
      entryUrl: alternate?.["@_href"] ?? "",
      description: entry.summary
        ? xmlText(entry.summary)
        : entry.content
          ? xmlText(entry.content)
          : "",
      creator: entry.author ? xmlText(entry.author.name) : "",
      mediaType: enclosure?.["@_type"] ?? "",
      mediaUrl: enclosure?.["@_href"] ?? "",
      tags: entry.category?.map((category) => category["@_term"]) ?? [],
      thumbnailUrl: "",
      publishedAt: normalizeDate(xmlText(entry.published ?? entry.updated)),
      draft: false,
    };
  });
};

const normalizeDate = (value: string): string => {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? value : new Date(timestamp).toISOString();
};
