import { Option, Schema } from "effect";
import { Scene, Url } from "foldkit";
import { describe, expect, test } from "vitest";
import { ChangedUrl, CompletedFocusTarget, CompletedNavigate, Flags, FocusTarget, Navigate, init, update, view } from "../app";
import { covers, paletteCss, selectedCover } from "./covers";

const flags = Schema.decodeUnknownSync(Flags)({ reports: [] });
const url = (path: string) => Option.getOrThrow(Url.fromString(`https://research.test${path}`));
const modelAt = (path: string) => init(flags, url(path)).model;

describe("cover moodboard", () => {
  test("links to the moodboard from the research homepage", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/")),
      Scene.expect(Scene.role("link", { name: "Judging books by their covers (jk jk)" })).toHaveAttr("href", "/moodboard/"),
    );
  });

  test("arrow keys navigate and wrap from the first cover to the last", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/moodboard/")),
      Scene.keydown(".cover-room", "ArrowUp"),
      Scene.Command.resolve(Navigate, CompletedNavigate()),
      Scene.Subscription.emit(ChangedUrl({ url: url("/moodboard/#cover-10") })),
      Scene.Command.resolve(FocusTarget, CompletedFocusTarget()),
      Scene.expect(Scene.role("heading", { level: 2, name: "The Origins of Efficiency" })).toExist(),
      Scene.keydown(".cover-room", "ArrowRight"),
      Scene.Command.resolve(Navigate, CompletedNavigate()),
      Scene.Subscription.emit(ChangedUrl({ url: url("/moodboard/#cover-1") })),
      Scene.Command.resolve(FocusTarget, CompletedFocusTarget()),
      Scene.expect(Scene.role("heading", { level: 2, name: covers[0].title })).toExist(),
    );
  });

  test("shows the five selected covers and the default cover palette", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/moodboard/")),
      Scene.expect(Scene.role("heading", { level: 1, name: "Judging books by their covers (jk jk)" })).toExist(),
      ...covers.map((cover) => Scene.expect(Scene.role("link", { name: `Study ${cover.title}` })).toHaveAttr("href", `/moodboard/#${cover.id}`)),
      Scene.expect(Scene.role("heading", { level: 2, name: covers[0].title })).toExist(),
      Scene.expect(Scene.text("#3C4435")).toExist(),
    );
  });

  test("a URL change updates the active cover and palette, including browser back", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/moodboard/#cover-4")),
      Scene.expect(Scene.role("heading", { level: 2, name: "Stubborn Attachments" })).toExist(),
      Scene.expect(Scene.text("#EE293B")).toExist(),
      Scene.Subscription.emit(ChangedUrl({ url: url("/moodboard/#cover-9") })),
      Scene.Command.resolve(FocusTarget, CompletedFocusTarget()),
      Scene.expect(Scene.role("heading", { level: 2, name: "The Big Score" })).toExist(),
      Scene.expect(Scene.text("#012538")).toExist(),
      Scene.expect(Scene.role("link", { name: "Study The Big Score" })).toHaveAttr("aria-current", "true"),
      Scene.Subscription.emit(ChangedUrl({ url: url("/moodboard/#cover-4") })),
      Scene.Command.resolve(FocusTarget, CompletedFocusTarget()),
      Scene.expect(Scene.role("heading", { level: 2, name: "Stubborn Attachments" })).toExist(),
    );
  });

  test("deep-links every selected cover with the matching source and downloadable palette", () => {
    covers.forEach((cover) => {
      Scene.scene({ update, view },
        Scene.given(modelAt(`/moodboard/#${cover.id}`)),
        Scene.expect(Scene.role("heading", { level: 2, name: cover.title })).toExist(),
        Scene.expect(Scene.role("link", { name: "Original cover ↗" })).toHaveAttr("href", `https://x.com/BookNoteApp/status/2124639562773520461/photo/${cover.photo}`),
        Scene.expect(Scene.role("link", { name: "Save CSS ↓" })).toHaveAttr("download", `${cover.id}-palette.css`),
      );
      cover.palette.forEach((color) => expect(paletteCss(cover)).toContain(color.hex));
    });
  });

  test("an unknown selection safely falls back to the first cover", () => {
    expect(selectedCover("not-a-cover")).toBe(covers[0]);
  });
});
