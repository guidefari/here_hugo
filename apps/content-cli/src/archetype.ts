import { Effect, FileSystem } from "effect";

import type { ContentPath } from "./content-path.ts";
import { ArchetypeNotFound, ContentFilesystemError, InvalidArchetype } from "./errors.ts";

/** Reads and renders the archetype selected from the content path. */
export const renderArchetype = (
  archetypePath: string,
  contentPath: ContentPath,
  now: Date,
): Effect.Effect<
  string,
  ArchetypeNotFound | InvalidArchetype | ContentFilesystemError,
  FileSystem.FileSystem
> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const template = yield* fs.readFileString(archetypePath).pipe(
      Effect.mapError((error) =>
        error.reason._tag === "NotFound"
          ? new ArchetypeNotFound({ path: archetypePath })
          : new ContentFilesystemError({ operation: "read-archetype", path: archetypePath }),
      ),
    );

    return yield* renderTemplate(template, contentPath, now);
  });

const renderTemplate = (
  template: string,
  contentPath: ContentPath,
  now: Date,
): Effect.Effect<string, InvalidArchetype> => {
  const values: Readonly<Record<string, string>> = {
    title: yamlString(contentPath.title),
    date: formatLocalRfc3339(now),
    path: contentPath.relativePath,
    urlEncodedTitle: encodeURIComponent(contentPath.title),
  };
  const placeholders = [...template.matchAll(/{{([^{}]*)}}/g)];

  for (const placeholder of placeholders) {
    const name = placeholder[1];
    if (name === undefined || !(name in values)) {
      return Effect.fail(new InvalidArchetype({ reason: "The archetype contains an unsupported placeholder." }));
    }
  }

  const rendered = template.replace(/{{([^{}]*)}}/g, (_match, name: string) => values[name] ?? "");
  if (rendered.includes("{{") || rendered.includes("}}")) {
    return Effect.fail(new InvalidArchetype({ reason: "The archetype contains a malformed placeholder." }));
  }

  return Effect.succeed(rendered);
};

const yamlString = (value: string): string => JSON.stringify(value);

const formatLocalRfc3339 = (date: Date): string => {
  const pad = (value: number) => value.toString().padStart(2, "0");
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    "T",
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
    `${sign}${pad(Math.floor(absoluteOffset / 60))}:${pad(absoluteOffset % 60)}`,
  ].join("");
};
