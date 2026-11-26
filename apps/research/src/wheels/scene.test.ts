import { Option, Schema } from "effect";
import { Scene, Url } from "foldkit";
import { describe, expect, test } from "vitest";
import {
  ChangedUrl, CompletedFocusWheel, CompletedNavigate, Flags, FocusWheel, Navigate, init, update, view,
} from "../app";
import { catalogue, mediaOf, tileId, wheelHref } from "./catalogue";
import type { Wheel } from "./catalogue";

const flags = Schema.decodeUnknownSync(Flags)({ reports: [] });
const url = (path: string) => Option.getOrThrow(Url.fromString(`https://research.test${path}`));
const modelAt = (path: string) => init(flags, url(path)).model;
const wheelAt = (index: number): Wheel => {
  const wheel = catalogue[index];
  if (!wheel) {
    throw new Error(`No wheel at ${index}`);
  }
  return wheel;
};
const arrive = (path: string) => [
  Scene.Command.resolve(Navigate, CompletedNavigate()),
  Scene.Subscription.emit(ChangedUrl({ url: url(path) })),
  Scene.Command.resolve(FocusWheel, CompletedFocusWheel()),
];

describe("wheel atlas", () => {
  test("the research library links to the visual study", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/")),
      Scene.expect(Scene.role("link", { name: "All stylings at a glance." })).toHaveAttr("href", "/wheels/"),
    );
  });

  test("the chart keeps all 63 catalogue positions in sequence plus the separate CSL reference", () => {
    expect(catalogue).toHaveLength(64);
    expect(catalogue.slice(0, 8).map((wheel) => wheel.id)).toEqual(["r1c1", "r1c2", "r1c3", "r1c4", "r1c5", "r1c6", "r1c7", "r1c8"]);
    expect(catalogue.filter((wheel) => wheel.identification === "Printed")).toHaveLength(57);
    expect(new Set(catalogue.filter((wheel) => wheel.number && wheel.identification === "Printed").map((wheel) => wheel.number)).size).toBe(55);
    expect(catalogue.filter((wheel) => wheel.identification === "Candidate" || wheel.identification === "Unresolved").map((wheel) => wheel.id))
      .toEqual(["r2c7", "r2c8", "r3c3", "r3c4", "r3c7", "r3c8"]);
    catalogue.filter((wheel) => !wheel.number).forEach((wheel) => {
      expect(wheel.media.every((media) => media.match === "Candidate")).toBe(true);
    });
  });

  test("the overview is a single stage with the chart beside it", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/wheels/")),
      Scene.expect(Scene.role("heading", { level: 1, name: "All stylings at a glance." })).toExist(),
      Scene.expect(Scene.role("link", { name: "Study the CSL" })).toHaveAttr("href", "/wheels/csl/"),
      Scene.expect(Scene.role("link", { name: "Overview" })).toHaveAttr("aria-current", "page"),
      Scene.expect(Scene.role("button", { name: "Sources and notes" })).toHaveAttr("popovertarget", "atlas-sources"),
    );
  });

  test("every position deep-links to its own stage and marks its chart tile", () => {
    catalogue.forEach((wheel) => {
      Scene.scene({ update, view },
        Scene.given(modelAt(wheelHref(wheel))),
        Scene.expect(Scene.role("heading", { level: 1, name: wheel.name })).toExist(),
        Scene.expect(Scene.role("link", { name: `${wheel.label}: ${wheel.name}` })).toHaveAttr("aria-current", "page"),
        Scene.expect(Scene.role("link", { name: "← Overview" })).toHaveAttr("href", "/wheels/"),
      );
    });
  });

  test("arrow keys walk the chart in sequence and by row, wrapping at the edges", () => {
    const second = wheelAt(1);
    const belowFirst = wheelAt(8);
    Scene.scene({ update, view },
      Scene.given(modelAt("/wheels/r1c1/")),
      Scene.keydown(".atlas-chart", "ArrowRight"),
      Scene.Command.expectExact(Navigate({ href: wheelHref(second) })),
      ...arrive(wheelHref(second)),
      Scene.expect(Scene.role("heading", { level: 1, name: second.name })).toExist(),
      Scene.keydown(".atlas-chart", "ArrowLeft"),
      ...arrive("/wheels/r1c1/"),
      Scene.keydown(".atlas-chart", "ArrowDown"),
      Scene.Command.expectExact(Navigate({ href: wheelHref(belowFirst) })),
      ...arrive(wheelHref(belowFirst)),
      Scene.keydown(".atlas-chart", "ArrowUp"),
      ...arrive("/wheels/r1c1/"),
      Scene.keydown(".atlas-chart", "ArrowUp"),
      Scene.Command.expectExact(Navigate({ href: wheelHref(wheelAt(56)) })),
      ...arrive(wheelHref(wheelAt(56))),
      Scene.expect(Scene.role("heading", { level: 1, name: wheelAt(56).name })).toExist(),
    );
  });

  test("a URL change focuses the selected chart tile rather than scrolling the page", () => {
    const wheel = wheelAt(12);
    expect(init(flags, url(wheelHref(wheel))).commands).toMatchObject([{ name: FocusWheel.name, args: { id: tileId(wheel) } }]);
    expect(init(flags, url("/wheels/")).commands).toMatchObject([{ name: FocusWheel.name, args: { id: "atlas-title" } }]);
  });

  test("closeup and on-car views switch in place, with buttons and arrow keys for photographs", () => {
    const wheel = catalogue.find((entry) => entry.id === "r2c5");
    if (!wheel) {
      throw new Error("Style 32 missing");
    }
    const onCar = mediaOf(wheel, "OnCar");
    Scene.scene({ update, view },
      Scene.given(modelAt("/wheels/r2c5/")),
      Scene.expect(Scene.role("button", { name: "Closeup, 1 photograph" })).toHaveAttr("aria-pressed", "true"),
      Scene.click(Scene.role("button", { name: `On car, ${onCar.length} photographs` })),
      Scene.expect(Scene.role("button", { name: `On car, ${onCar.length} photographs` })).toHaveAttr("aria-pressed", "true"),
      Scene.expect(Scene.text(`1 / ${onCar.length}`)).toExist(),
      Scene.expect(Scene.role("img", { name: `${onCar[0]?.subject}. Visual match.` })).toHaveAttr("src", onCar[0]?.src ?? ""),
      Scene.click(Scene.role("button", { name: "Next photograph" })),
      Scene.expect(Scene.text(`2 / ${onCar.length}`)).toExist(),
      Scene.keydown(".atlas-stage", "ArrowLeft"),
      Scene.expect(Scene.text(`1 / ${onCar.length}`)).toExist(),
      Scene.keydown(".atlas-stage", "ArrowLeft"),
      Scene.expect(Scene.text(`${onCar.length} / ${onCar.length}`)).toExist(),
       Scene.click(Scene.role("button", { name: "View photograph 2" })),
       Scene.expect(Scene.role("button", { name: "View photograph 2" })).toHaveAttr("aria-pressed", "true"),
       Scene.expect(Scene.text(`2 / ${onCar.length}`)).toExist(),
       Scene.click(Scene.role("button", { name: "Closeup, 1 photograph" })),
       Scene.expect(Scene.role("button", { name: "Closeup, 1 photograph" })).toHaveAttr("aria-pressed", "true"),
       Scene.expect(Scene.role("button", { name: "Chart crop" })).toBeAbsent(),
    );
  });

  test("the chosen view survives wheel changes and temporarily unavailable on-car photos", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/wheels/r2c5/")),
      Scene.click(Scene.role("button", { name: /^On car,/ })),
      Scene.Subscription.emit(ChangedUrl({ url: url("/wheels/r1c2/") })),
      Scene.Command.resolve(FocusWheel, CompletedFocusWheel()),
      Scene.expect(Scene.role("button", { name: /^On car,/ })).toHaveAttr("aria-pressed", "true"),
      Scene.Subscription.emit(ChangedUrl({ url: url("/wheels/r3c7/") })),
      Scene.Command.resolve(FocusWheel, CompletedFocusWheel()),
      Scene.expect(Scene.role("button", { name: /^Closeup,/ })).toHaveAttr("aria-pressed", "true"),
      Scene.expect(Scene.role("button", { name: "On car, 0 photographs" })).toBeDisabled(),
      Scene.Subscription.emit(ChangedUrl({ url: url("/wheels/r2c5/") })),
      Scene.Command.resolve(FocusWheel, CompletedFocusWheel()),
      Scene.expect(Scene.role("button", { name: /^On car,/ })).toHaveAttr("aria-pressed", "true"),
    );
  });

  test("Escape and the overview link return to the overview", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/wheels/r8c6/")),
      Scene.keydown(".atlas-stage", "Escape"),
      Scene.Command.expectExact(Navigate({ href: "/wheels/" })),
      ...arrive("/wheels/"),
      Scene.expect(Scene.role("heading", { level: 1, name: "All stylings at a glance." })).toExist(),
    );
  });

  test("unresolved positions show only the chart crop and disclose the gap", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/wheels/r2c7/")),
      Scene.expect(Scene.role("button", { name: "Closeup, 0 photographs" })).toBeDisabled(),
      Scene.expect(Scene.role("button", { name: "On car, 0 photographs" })).toBeDisabled(),
      Scene.expect(Scene.text("No verified photograph for this position. Shown is the original chart crop, 71 × 88 px, enlarged.")).toExist(),
      Scene.expect(Scene.text("Unnumbered, unresolved")).toExist(),
    );
  });

  test("candidate identifications stay labelled as candidates", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/wheels/r3c4/")),
      Scene.expect(Scene.text("Unnumbered, candidate only")).toExist(),
      Scene.expect(Scene.text("Candidate")).toExist(),
    );
  });

  test("unknown styles offer a way back", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/wheels/not-a-wheel/")),
      Scene.expect(Scene.role("heading", { level: 1, name: "Style not found." })).toExist(),
      Scene.expect(Scene.role("link", { name: "← Back to the overview" })).toHaveAttr("href", "/wheels/"),
    );
  });
});
