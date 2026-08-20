import { describe, expect, test } from "bun:test";
import * as Result from "effect/Result";
import { fromMediaEntry } from "./discord-embed-payload";
import { decodeAtom, decodeJsonFeed, decodeRss } from "./feed-decoders";
import type { FeedSource } from "./feed-source";

const source = (format: FeedSource["format"]): FeedSource => ({
  id: "test-source",
  name: "Test source",
  enabled: true,
  feedUrl: "https://example.com/feed",
  format,
  absenceMeansRemoved: false,
  backfill: { postCount: 10, publishHourUtc: 12 },
});

describe("feed decoders", () => {
  test("decodes JSON Feed media metadata", () => {
    const results = decodeJsonFeed(source("json-feed"), JSON.stringify({
      version: "https://jsonfeed.org/version/1.1",
      items: [{
        id: "entry-1",
        url: "https://example.com/entry-1/",
        title: "Entry one",
        summary: "Summary",
        date_published: "2026-07-25T22:00:00.000Z",
        authors: [{ name: "Creator" }],
        tags: ["video"],
        _here: {
          media_type: "youtube",
          media_url: "https://www.youtube.com/watch?v=example",
          thumbnail_url: "https://example.com/thumbnail.jpg",
          draft: false,
        },
      }],
    }));

    expect(results).toHaveLength(1);
    expect(Result.isSuccess(results[0]!)).toBe(true);
    if (Result.isSuccess(results[0]!)) {
      expect(results[0]!.success.creator).toBe("Creator");
      expect(results[0]!.success.mediaType).toBe("youtube");
    }
  });

  test("decodes RSS", () => {
    const results = decodeRss(source("rss"), `
      <rss><channel><item>
        <title>RSS entry</title>
        <link>https://example.com/rss-entry/</link>
        <guid isPermaLink="false">rss-1</guid>
        <description>RSS summary</description>
        <pubDate>Sat, 25 Jul 2026 22:00:00 GMT</pubDate>
        <category>audio</category>
        <enclosure url="https://example.com/audio.mp3" type="audio/mpeg" />
      </item></channel></rss>
    `);

    expect(results).toHaveLength(1);
    expect(Result.isSuccess(results[0]!)).toBe(true);
    if (Result.isSuccess(results[0]!)) expect(results[0]!.success.entryIdentity).toBe("rss-1");
  });

  test("decodes Atom", () => {
    const results = decodeAtom(source("atom"), `
      <feed xmlns="http://www.w3.org/2005/Atom"><entry>
        <id>atom-1</id>
        <title type="text">Atom entry</title>
        <updated>2026-07-25T22:00:00.000Z</updated>
        <summary>Atom summary</summary>
        <link rel="alternate" href="https://example.com/atom-entry/" />
        <link rel="enclosure" href="https://example.com/video.mp4" type="video/mp4" />
        <author><name>Atom creator</name></author>
        <category term="video" />
      </entry></feed>
    `);

    expect(results).toHaveLength(1);
    expect(Result.isSuccess(results[0]!)).toBe(true);
    if (Result.isSuccess(results[0]!)) expect(results[0]!.success.mediaType).toBe("video/mp4");
  });

  test("rejects one malformed entry without dropping valid peers", () => {
    const results = decodeJsonFeed(source("json-feed"), JSON.stringify({
      version: "https://jsonfeed.org/version/1.1",
      items: [
        { id: "bad", title: "Missing URL" },
        {
          id: "good",
          url: "https://example.com/good/",
          title: "Good",
          date_published: "2026-07-25T22:00:00.000Z",
        },
      ],
    }));

    expect(Result.isFailure(results[0]!)).toBe(true);
    expect(Result.isSuccess(results[1]!)).toBe(true);
  });
});

test("Discord projection disables mentions and enforces embed limits", () => {
  const payload = fromMediaEntry({
    sourceId: "test",
    entryIdentity: "entry",
    title: "x".repeat(300),
    entryUrl: "https://example.com/entry/",
    description: "y".repeat(5_000),
    creator: "Creator",
    mediaType: "video",
    mediaUrl: "https://example.com/video.mp4",
    tags: ["media"],
    thumbnailUrl: "",
    publishedAt: "2026-07-25T22:00:00.000Z",
    draft: false,
  });

  expect(payload.allowed_mentions.parse).toEqual([]);
  expect(payload.embeds[0]!.title.length).toBe(256);
  const embed = payload.embeds[0]!;
  const totalCharacters = embed.title.length
    + (embed.description?.length ?? 0)
    + (embed.author?.name.length ?? 0)
    + (embed.fields?.reduce((total, field) => total + field.name.length + field.value.length, 0) ?? 0);
  expect(totalCharacters).toBeLessThanOrEqual(6_000);
});
