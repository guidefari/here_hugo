import { Option, Schema } from "effect";
import { Navigation, Scene, Url } from "foldkit";
import { describe, expect, test } from "vitest";
import generated from "../.generated/reports.json";
import { ChangedUrl, ClickedLink, CompletedFocusTarget, Flags, FocusTarget, init, update, view } from "./app";

const flags = Schema.decodeUnknownSync(Flags)({ reports: generated });
const url = (path: string) => Option.getOrThrow(Url.fromString(`https://research.test${path}`));
const modelAt = (path: string) => init(flags, url(path)).model;

describe("research reader", () => {
  test("the library links to the GPU app and hands same-origin navigation to its separate runtime", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/")),
      Scene.expect(Scene.role("link", { name: "The GPU lab" })).toHaveAttr("href", "/gpu/"),
    );
    const next = update(modelAt("/"), ClickedLink({
      request: Navigation.UrlRequest.Internal({ url: url("/gpu/scenes/image-mosaic") }),
    }));
    expect(next.commands).toMatchObject([{
      name: "LoadExternal",
      args: { href: "https://research.test/gpu/scenes/image-mosaic" },
    }]);
  });

  test("lists the main reports and filters by title without promoting source notes", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/")),
      Scene.inside(Scene.role("banner"),
        Scene.expect(Scene.role("link", { name: "Skip to content" })).toHaveAttr("href", "#main-content")),
      Scene.expect(Scene.role("status")).toHaveText("6 of 6 reports"),
      Scene.expect(Scene.role("link", { name: "How does an Android emulator stream into a terminal?" })).toHaveAttr("href", "/reports/android-emulator-stream/"),
      Scene.type(Scene.label("Find a report"), "sops"),
      Scene.expect(Scene.role("status")).toHaveText("1 of 6 reports"),
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

  test("opens the reading map, selects a chapter, and closes the compact map", () => {
    const map = (chapter: string) => ({ name: `Reading map, chapter ${chapter}` });
    Scene.scene({ update, view },
      Scene.given(modelAt("/reports/sops/")),
      Scene.expect(Scene.role("button", map("1 of 9: Overview"))).toHaveAttr("aria-expanded", "false"),
      Scene.click(Scene.role("button", map("1 of 9: Overview"))),
      Scene.expect(Scene.role("button", map("1 of 9: Overview"))).toHaveAttr("aria-expanded", "true"),
      Scene.Subscription.emit(ChangedUrl({ url: url("/reports/sops/#why-keep-an-encrypted-file-in-git") })),
      Scene.Command.resolve(FocusTarget, CompletedFocusTarget()),
      Scene.expect(Scene.role("button", map("4 of 9: Why keep an encrypted file in Git?"))).toHaveAttr("aria-expanded", "false"),
      Scene.expect(Scene.role("link", { name: "Why keep an encrypted file in Git?" })).toHaveAttr("aria-current", "step"),
      Scene.expect(Scene.text("Chapter 4 of 9")).toExist(),
      Scene.expect(Scene.role("link", { name: "Next chapter: Two ways deployment tools can consume it" })).toHaveAttr("href", "#two-ways-deployment-tools-can-consume-it"),
      Scene.expect(Scene.role("link", { name: "Previous chapter: SOPS and age do different jobs" })).toHaveAttr("href", "#sops-and-age-do-different-jobs"),
    );
  });

  test("keeps the full report introduction on the overview and a compact title on later chapters", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/reports/sops/")),
      Scene.expect(Scene.selector(".report-header.is-full")).toExist(),
      Scene.Subscription.emit(ChangedUrl({ url: url("/reports/sops/#what-sops-does-not-protect") })),
      Scene.Command.resolve(FocusTarget, CompletedFocusTarget()),
      Scene.expect(Scene.selector(".report-header.is-compact")).toExist(),
      Scene.expect(Scene.role("heading", { level: 1, name: "SOPS, age, and the secret's journey from Git to deployment" })).toExist(),
      Scene.expect(Scene.text("Generated with AI assistance. Claims may be incomplete or out of date. Check the linked sources before relying on them.")).toExist(),
    );
  });

  test("resolves an existing subsection link to its chapter, including on browser back", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/reports/sops/#flux-in-a-kubernetes-cluster")),
      Scene.expect(Scene.role("link", { name: "Two ways deployment tools can consume it" })).toHaveAttr("aria-current", "step"),
      Scene.Subscription.emit(ChangedUrl({ url: url("/reports/sops/#reading-overview") })),
      Scene.Command.resolve(FocusTarget, CompletedFocusTarget()),
      Scene.expect(Scene.role("link", { name: "Overview" })).toHaveAttr("aria-current", "step"),
    );
  });
});
