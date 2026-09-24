import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { NodeServices } from "@effect/platform-node";
import { Cause, Effect, Exit, Option } from "effect";
import { describe, expect, it } from "@effect/vitest";

import { parseAllowedTags } from "./tag-catalog.ts";
import { inspectTags, lintContentTags } from "./tag-lint.ts";
import { formatFinding } from "./tag-lint-main.ts";

const makeFixture = Effect.tryPromise({
  try: async () => {
    const root = await mkdtemp(join(tmpdir(), "here-tag-lint-"));
    await mkdir(join(root, "content"));
    await writeFile(join(root, "content-tags.json"), JSON.stringify({ allowedTags: ["note", "graphics"] }));
    await writeFile(join(root, "content-cli.config.json"), JSON.stringify({
      contentRoot: "content",
      archetypes: Object.fromEntries([
        "album", "artist", "bliki", "book", "docker-presentation", "media", "mix", "note",
        "playlist", "read", "resource", "til", "track",
      ].map((kind) => [kind, "archetypes/note.md"])),
    }));
    return root;
  },
  catch: (error) => error,
});

const withFixture = <A, E, R>(use: (root: string) => Effect.Effect<A, E, R>) =>
  Effect.acquireUseRelease(
    makeFixture,
    use,
    (root) => Effect.promise(() => rm(root, { recursive: true, force: true })),
  );

const lint = (root: string) => lintContentTags(root).pipe(Effect.provide(NodeServices.layer));
const writeMarkdown = (root: string, name: string, source: string) => Effect.promise(async () => {
  const destination = join(root, "content", name);
  await mkdir(join(destination, ".."), { recursive: true });
  await writeFile(destination, source);
});

const errorTag = (exit: Exit.Exit<unknown, { readonly _tag: string }>) =>
  Exit.isFailure(exit) ? Option.getOrUndefined(Cause.findErrorOption(exit.cause))?._tag : undefined;

describe("content tag lint", () => {
  it.effect("checks an allowed label in a real Markdown file", () =>
    withFixture((root) => writeMarkdown(root, "note/ok.md", "---\ntags: [note]\n---\n").pipe(
      Effect.flatMap(() => lint(root)),
      Effect.tap((report) => Effect.sync(() => expect(report).toEqual({ filesChecked: 1, findings: [] }))),
    )),
  );

  it.effect("reports all unknown labels in stable file and tag order", () =>
    withFixture((root) => Effect.gen(function* () {
      yield* writeMarkdown(root, "z.md", "---\ntags: [Other, note, last]\n---\n");
      yield* writeMarkdown(root, "a/first.md", "---\ntags: [unknown]\n---\n");
      const report = yield* lint(root);
      expect(report.filesChecked).toBe(2);
      expect(report.findings).toEqual([
        { relativePath: "a/first.md", kind: "unknown-tag", tag: "unknown" },
        { relativePath: "z.md", kind: "unknown-tag", tag: "Other" },
        { relativePath: "z.md", kind: "unknown-tag", tag: "last" },
      ]);
      expect(formatFinding(report.findings[0])).toBe('a/first.md: unknown tag "unknown"');
    })),
  );

  it.effect("allows missing and empty tags, but reports malformed tags and frontmatter", () =>
    withFixture((root) => Effect.gen(function* () {
      yield* writeMarkdown(root, "a.md", "---\ntitle: No tags\n---\n");
      yield* writeMarkdown(root, "b.md", "---\r\ntags: []\r\n---\r\n");
      yield* writeMarkdown(root, "c.md", "---\ntags: note\n---\n");
      yield* writeMarkdown(root, "d.md", "---\ntags: [note, 3]\n---\n");
      yield* writeMarkdown(root, "e.md", "---\ntags: [broken\n---\n");
      yield* writeMarkdown(root, "f.md", "No frontmatter");
      const report = yield* lint(root);
      expect(report.filesChecked).toBe(6);
      expect(report.findings.map(({ relativePath, kind }) => [relativePath, kind])).toEqual([
        ["c.md", "invalid-tags"], ["d.md", "invalid-tags"],
        ["e.md", "invalid-frontmatter"], ["f.md", "invalid-frontmatter"],
      ]);
    })),
  );

  it.effect("ignores instruction files and an empty placeholder", () =>
    withFixture((root) => Effect.gen(function* () {
      yield* writeMarkdown(root, "media/AGENTS.md", "Instructions for writing media entries");
      yield* writeMarkdown(root, "frontpage.md", "");
      yield* writeMarkdown(root, "note/entry.md", "---\ntags: [graphics]\n---\n");
      const report = yield* lint(root);
      expect(report).toEqual({ filesChecked: 2, findings: [] });
    })),
  );

  it.effect("rejects duplicate, empty and invalid catalog entries", () =>
    Effect.gen(function* () {
      for (const input of [
        { allowedTags: ["note", "note"] }, { allowedTags: [] },
        { allowedTags: ["note", ""] }, { allowedTags: ["note", 1] },
      ]) {
        const result = yield* parseAllowedTags(input).pipe(Effect.exit);
        expect(errorTag(result)).toBe("InvalidTagCatalog");
      }
    }),
  );

  it.effect("fails with typed errors for missing content and bad catalog JSON", () =>
    withFixture((root) => Effect.gen(function* () {
      yield* Effect.promise(() => rm(join(root, "content"), { recursive: true }));
      expect(errorTag(yield* lint(root).pipe(Effect.exit))).toBe("ContentScanFailed");
      yield* Effect.promise(() => mkdir(join(root, "content")));
      yield* Effect.promise(() => writeFile(join(root, "content-tags.json"), "{"));
      expect(errorTag(yield* lint(root).pipe(Effect.exit))).toBe("InvalidTagCatalog");
    })),
  );

  it("only inspects the optional tags field", () => {
    expect(inspectTags("file.md", { tags: ["note"], unrelated: 42 }, new Set(["note"]))).toEqual([]);
  });
});
