import { Effect, FileSystem, Path, Predicate, Schema } from "effect";

import { loadContentRoots } from "./config.ts";
import type { AllowedTags } from "./tag-catalog.ts";
import { loadAllowedTags } from "./tag-catalog.ts";
import type { InvalidTagCatalog } from "./tag-catalog.ts";
import type { InvalidContentCliConfig } from "./errors.ts";

export class ContentScanFailed extends Schema.TaggedError<ContentScanFailed>()(
  "ContentScanFailed",
  { operation: Schema.Literals(["list", "stat", "read"]), path: Schema.String },
) {}

export type ContentFinding =
  | { readonly relativePath: string; readonly kind: "unknown-tag"; readonly tag: string }
  | { readonly relativePath: string; readonly kind: "invalid-frontmatter" | "invalid-tags"; readonly reason: string };

export type TagLintReport = {
  readonly filesChecked: number;
  readonly findings: ReadonlyArray<ContentFinding>;
};

export const inspectTags = (relativePath: string, frontmatter: unknown, allowed: AllowedTags): ReadonlyArray<ContentFinding> => {
  if (!Predicate.isObject(frontmatter) || Array.isArray(frontmatter)) {
    return [{ relativePath, kind: "invalid-frontmatter", reason: "Frontmatter must be a YAML mapping." }];
  }
  if (!("tags" in frontmatter)) return [];
  const tags = frontmatter.tags;
  if (!Array.isArray(tags) || !tags.every(Predicate.isString)) {
    return [{ relativePath, kind: "invalid-tags", reason: "tags must be an array of strings." }];
  }
  return tags.filter((tag) => !allowed.has(tag)).map((tag) => ({ relativePath, kind: "unknown-tag", tag }));
};

export const inspectMarkdown = (relativePath: string, source: string, allowed: AllowedTags): ReadonlyArray<ContentFinding> => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!match) return [{ relativePath, kind: "invalid-frontmatter", reason: "Missing or unterminated YAML frontmatter." }];
  try {
    const parsed: unknown = Bun.YAML.parse(match[1]);
    return inspectTags(relativePath, parsed, allowed);
  } catch {
    return [{ relativePath, kind: "invalid-frontmatter", reason: "Could not parse YAML frontmatter." }];
  }
};

export const lintContentTags = Effect.fn("lintContentTags")(function* (repositoryRoot: string): Effect.fn.Return<TagLintReport, InvalidTagCatalog | InvalidContentCliConfig | ContentScanFailed, FileSystem.FileSystem | Path.Path> {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const roots = yield* loadContentRoots(repositoryRoot);
  const allowed = yield* loadAllowedTags(repositoryRoot);
  const files: Array<{ readonly absolutePath: string; readonly relativePath: string }> = [];

  const visit = (directory: string): Effect.Effect<void, ContentScanFailed> => Effect.gen(function* () {
    const relativeDirectory = path.relative(roots.contentRoot, directory) || ".";
    const entries = yield* fs.readDirectory(directory).pipe(
      Effect.mapError(() => new ContentScanFailed({ operation: "list", path: relativeDirectory })),
    );
    for (const entry of entries.sort()) {
      const absolutePath = path.join(directory, entry);
      const relativePath = path.relative(roots.contentRoot, absolutePath).split(path.sep).join("/");
      const info = yield* fs.stat(absolutePath).pipe(
        Effect.mapError(() => new ContentScanFailed({ operation: "stat", path: relativePath })),
      );
      if (info.type === "Directory") yield* visit(absolutePath);
      else if (info.type === "File" && entry.endsWith(".md") && entry !== "AGENTS.md") files.push({ absolutePath, relativePath });
    }
  });

  yield* visit(roots.contentRoot);
  files.sort((a, b) => a.relativePath < b.relativePath ? -1 : a.relativePath > b.relativePath ? 1 : 0);
  const findings: Array<ContentFinding> = [];
  for (const file of files) {
    const source = yield* fs.readFileString(file.absolutePath).pipe(
      Effect.mapError(() => new ContentScanFailed({ operation: "read", path: file.relativePath })),
    );
    if (source.trim() !== "") findings.push(...inspectMarkdown(file.relativePath, source, allowed));
  }
  return { filesChecked: files.length, findings };
});
