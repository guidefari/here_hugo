import { Option, Schema } from "effect";
import { Scene, Url } from "foldkit";
import { describe, test } from "vitest";
import generated from "../.generated/reports.json";
import { ChangedUrl, CompletedFocusTarget, Flags, FocusTarget, init, update, view } from "./app";

const flags = Schema.decodeUnknownSync(Flags)({ reports: generated });
const url = (path: string) => Option.getOrThrow(Url.fromString(`https://research.test${path}`));
const modelAt = (path: string) => init(flags, url(path)).model;

describe("research reader", () => {
  test("lists the five main reports and filters by title without promoting source notes", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/")),
      Scene.expect(Scene.role("status")).toHaveText("5 of 5 reports"),
      Scene.type(Scene.label("Find a report"), "sops"),
      Scene.expect(Scene.role("status")).toHaveText("1 of 5 reports"),
      Scene.expect(Scene.role("link", { name: "SOPS, age, and the secret's journey from Git to deployment" })).toExist(),
    );
  });

  test("renders a deep-linked report and moves to its supporting note through URL changes", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/reports/cloudflare-npm/")),
      Scene.expect(Scene.role("heading", { level: 1, name: "Cloudflare can challenge npm beyond delivery" })).toExist(),
      Scene.expect(Scene.text("Supporting research (23 notes)")).toExist(),
      Scene.Subscription.emit(ChangedUrl({ url: url("/reports/cloudflare-npm/sources/jsr-architecture/") })),
      Scene.Command.resolve(FocusTarget, CompletedFocusTarget()),
      Scene.expect(Scene.role("link", { name: "Part of: Cloudflare can challenge npm beyond delivery" })).toHaveAttr("href", "/reports/cloudflare-npm/"),
    );
  });

  test("never exposes drafts through a guessed direct URL", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/reports/example/")),
      Scene.expect(Scene.role("heading", { level: 1, name: "Not on this shelf." })).toExist(),
    );
  });
});
