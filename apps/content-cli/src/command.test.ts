import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { NodeServices } from "@effect/platform-node";
import { Cause, Clock, Effect, Exit, Option } from "effect";
import { describe, expect, it } from "@effect/vitest";

import { createContent } from "./command.ts";
import { loadContentRoots, type ContentRoots } from "./config.ts";
import { parseContentPath } from "./content-path.ts";

const fixedTime = 1_704_164_645_000;
const fixedClock: Clock.Clock = {
  currentTimeMillisUnsafe: () => fixedTime,
  currentTimeMillis: Effect.succeed(fixedTime),
  currentTimeNanosUnsafe: () => BigInt(fixedTime) * 1_000_000n,
  currentTimeNanos: Effect.succeed(BigInt(fixedTime) * 1_000_000n),
  monotonicTimeNanosUnsafe: () => 0n,
  monotonicTimeNanos: Effect.succeed(0n),
  sleep: () => Effect.void,
};

const noteTemplate = `---
title: {{title}}
date: {{date}}
path: {{path}}
url: {{urlEncodedTitle}}
tags: [note]
---
`;

const archetypePaths = (archetypeRoot: string): ContentRoots["archetypes"] => ({
  album: join(archetypeRoot, "note.md"),
  artist: join(archetypeRoot, "note.md"),
  bliki: join(archetypeRoot, "note.md"),
  book: join(archetypeRoot, "note.md"),
  "docker-presentation": join(archetypeRoot, "note.md"),
  media: join(archetypeRoot, "note.md"),
  mix: join(archetypeRoot, "note.md"),
  note: join(archetypeRoot, "note.md"),
  playlist: join(archetypeRoot, "note.md"),
  read: join(archetypeRoot, "note.md"),
  resource: join(archetypeRoot, "note.md"),
  til: join(archetypeRoot, "note.md"),
  track: join(archetypeRoot, "note.md"),
});

type Fixture = {
  readonly root: string;
  readonly roots: ContentRoots;
};

const makeFixture = (template = noteTemplate) =>
  Effect.tryPromise({
    try: async (): Promise<Fixture> => {
      const root = await mkdtemp(join(tmpdir(), "here-content-cli-"));
      const archetypeRoot = join(root, "archetypes");
      const contentRoot = join(root, "content");
      await mkdir(archetypeRoot, { recursive: true });
      await writeFile(join(archetypeRoot, "note.md"), template);
      return { root, roots: { contentRoot, archetypes: archetypePaths(archetypeRoot) } };
    },
    catch: (cause) => cause,
  });

const removeFixture = (fixture: Fixture) =>
  Effect.promise(() => rm(fixture.root, { recursive: true, force: true }));

const withFixture = <A, E, R>(
  use: (fixture: Fixture) => Effect.Effect<A, E, R>,
  template?: string,
): Effect.Effect<A, E | unknown, R> => Effect.acquireUseRelease(makeFixture(template), use, removeFixture);

const createWithFixture = (fixture: Fixture, arguments_: ReadonlyArray<string>) =>
  createContent(arguments_, fixture.roots).pipe(
    Effect.provide(NodeServices.layer),
    Effect.provideService(Clock.Clock, fixedClock),
  );

describe("content:new", () => {
  it.effect("loads repository-relative roots from configuration", () =>
    withFixture((fixture) =>
      Effect.promise(() =>
        writeFile(
          join(fixture.root, "content-cli.config.json"),
          JSON.stringify({
            contentRoot: "content",
            archetypes: Object.fromEntries(
              Object.keys(archetypePaths("/")).map((kind) => [kind, "archetypes/note.md"]),
            ),
          }),
        ),
      ).pipe(
        Effect.flatMap(() => loadContentRoots(fixture.root)),
        Effect.provide(NodeServices.layer),
        Effect.tap((roots) =>
          Effect.sync(() => {
            expect(roots.contentRoot).toBe(join(fixture.root, "content"));
            expect(roots.archetypes.note).toBe(join(fixture.root, "archetypes", "note.md"));
            expect(roots.archetypes.til).toBe(join(fixture.root, "archetypes", "note.md"));
          }),
        ),
      ),
    ),
  );

  it.effect("normalizes a note path and derives its title", () =>
    parseContentPath("note/Break-The_Chains", "/content", archetypePaths("/archetypes")).pipe(
      Effect.provide(NodeServices.layer),
      Effect.tap((contentPath) =>
        Effect.sync(() => {
          expect(contentPath).toMatchObject({
            relativePath: "note/Break-The_Chains.md",
            outputPath: "/content/note/Break-The_Chains.md",
            title: "Break The Chains",
          });
        }),
      ),
    ),
  );

  it.effect("rejects traversal, other sections, and unsupported extensions", () =>
    Effect.all([
      "note/../secret",
      "note/example.txt",
      "/note/absolute",
    ].map((input) => parseContentPath(input, "/content", archetypePaths("/archetypes")).pipe(Effect.exit, Effect.provide(NodeServices.layer)))).pipe(
      Effect.tap((results) =>
        Effect.sync(() => {
          for (const result of results) {
            expect(Exit.isFailure(result)).toBe(true);
            if (Exit.isFailure(result)) {
              expect(failureTag(result)).toBe("InvalidContentPath");
            }
          }
        }),
      ),
    ),
  );

  it.effect("uses the first path segment to select an archetype", () =>
    withFixture((fixture) =>
      createWithFixture(fixture, ["til/my-new-thing"]).pipe(
        Effect.tap((relativePath) =>
          Effect.sync(() => {
            expect(relativePath).toBe("til/my-new-thing.md");
          }),
        ),
      ),
    ),
  );

  it.effect("rejects an unconfigured section", () =>
    withFixture((fixture) =>
      createWithFixture(fixture, ["writing/not-a-leaf"]).pipe(
        Effect.exit,
        Effect.tap((result) =>
          Effect.sync(() => {
            expect(Exit.isFailure(result)).toBe(true);
            if (Exit.isFailure(result)) {
              expect(failureTag(result)).toBe("ArchetypeNotConfigured");
            }
          }),
        ),
      ),
    ),
  );

  it.effect("rejects the removed --kind option", () =>
    withFixture((fixture) =>
      createWithFixture(fixture, ["--kind", "til", "note/example"]).pipe(
        Effect.exit,
        Effect.tap((result) =>
          Effect.sync(() => {
            expect(Exit.isFailure(result)).toBe(true);
            if (Exit.isFailure(result)) {
              expect(failureTag(result)).toBe("InvalidContentPath");
            }
          }),
        ),
      ),
    ),
  );

  it.effect("creates a rendered note through the filesystem seam", () =>
    withFixture((fixture) =>
      createWithFixture(fixture, ["note/my_yaml-title"]).pipe(
        Effect.tap((relativePath) =>
          Effect.promise(async () => {
            expect(relativePath).toBe("note/my_yaml-title.md");
            const content = await readFile(join(fixture.roots.contentRoot, relativePath), "utf8");
            expect(content).toBe(`---\ntitle: "My Yaml Title"\ndate: ${formatLocalRfc3339(new Date(fixedTime))}\npath: note/my_yaml-title.md\nurl: My%20Yaml%20Title\ntags: [note]\n---\n`);
          }),
        ),
      ),
    ),
  );

  it.effect("refuses to overwrite an existing note", () =>
    withFixture((fixture) =>
      Effect.promise(async () => {
        const destination = join(fixture.roots.contentRoot, "note", "existing.md");
        await mkdir(join(fixture.roots.contentRoot, "note"), { recursive: true });
        await writeFile(destination, "original");
      }).pipe(
        Effect.flatMap(() => createWithFixture(fixture, ["note/existing"]).pipe(Effect.exit)),
        Effect.tap((result) =>
          Effect.promise(async () => {
            expect(Exit.isFailure(result)).toBe(true);
            if (Exit.isFailure(result)) {
              expect(failureTag(result)).toBe("ContentAlreadyExists");
            }
            expect(await readFile(join(fixture.roots.contentRoot, "note", "existing.md"), "utf8")).toBe("original");
          }),
        ),
      ),
    ),
  );

  it.effect("rejects malformed note template placeholders before writing", () =>
    withFixture(
      (fixture) =>
        createWithFixture(fixture, ["note/bad-template"]).pipe(
          Effect.exit,
          Effect.tap((result) =>
            Effect.sync(() => {
              expect(Exit.isFailure(result)).toBe(true);
              if (Exit.isFailure(result)) {
                expect(failureTag(result)).toBe("InvalidArchetype");
              }
            }),
          ),
        ),
      "---\ntitle: {{unknown}}\n---\n",
    ),
  );
});

const failureTag = (exit: Exit.Exit<unknown, { readonly _tag: string }>): string | undefined => {
  if (!Exit.isFailure(exit)) {
    return undefined;
  }
  return Option.getOrUndefined(Cause.findErrorOption(exit.cause))?._tag;
};

const formatLocalRfc3339 = (date: Date): string => {
  const pad = (value: number) => value.toString().padStart(2, "0");
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${pad(Math.floor(absoluteOffset / 60))}:${pad(absoluteOffset % 60)}`;
};
