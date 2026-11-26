import { Option, Schema } from "effect";
import { Navigation, Scene, Url } from "foldkit";
import { describe, expect, test } from "vitest";
import {
  ChangedUrl, ClickedLink, CompletedFocusFoundation, CompletedFocusTarget, Flags, FocusFoundation, FocusTarget,
  Navigate, foundationsQueryId, init, update, view,
} from "../app";
import { breadth, modules, routes, strands } from "./curriculum";
import { detailHeadingId, moduleHref, routeHref } from "./map";

const flags = Schema.decodeUnknownSync(Flags)({ reports: [] });
const url = (path: string) => Option.getOrThrow(Url.fromString(`https://research.test${path}`));
const modelAt = (path: string) => init(flags, url(path)).model;
const arrive = (path: string) => [
  Scene.Subscription.emit(ChangedUrl({ url: url(path) })),
  Scene.Command.resolve(FocusFoundation, CompletedFocusFoundation()),
];

describe("computer science foundations map", () => {
  test("the library and primary navigation link to the map", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/")),
      Scene.expect(Scene.role("link", { name: "A computer science foundations map" })).toHaveAttr("href", "/foundations/"),
      Scene.inside(Scene.role("navigation", { name: "Primary" }),
        Scene.expect(Scene.role("link", { name: "Foundations" })).toHaveAttr("aria-current", "false")),
    );
  });

  test("the overview shows all four strands, sixteen modules, breadth, and project routes", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/foundations/")),
      Scene.expect(Scene.role("heading", { level: 1, name: "A computer science foundations map" })).toExist(),
      Scene.inside(Scene.role("navigation", { name: "Primary" }),
        Scene.expect(Scene.role("link", { name: "Foundations" })).toHaveAttr("aria-current", "page")),
      ...strands.map((strand) => Scene.expect(Scene.role("heading", { level: 3, name: strand.title })).toExist()),
      ...modules.map((module) => Scene.expect(Scene.selector(`.fm-map a[href="${moduleHref(module)}"]`)).toExist()),
      ...breadth.map((area) => Scene.expect(Scene.role("link", { name: area.title })).toExist()),
      ...routes.map((route) => Scene.expect(Scene.role("link", { name: route.question })).toHaveAttr("href", routeHref(route))),
      Scene.expect(Scene.role("heading", { level: 2, name: "Structure for coverage, curiosity for entry points" })).toExist(),
      Scene.expect(Scene.role("heading", { level: 2, name: "Sources and scope" })).toExist(),
    );
    expect(init(flags, url("/foundations/")).commands).toMatchObject([{ name: FocusTarget.name, args: { id: "main-content" } }]);
  });

  test("selecting a module marks what helps first and what builds on it", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/foundations/")),
      ...arrive("/foundations/networking/"),
      Scene.expect(Scene.role("heading", { level: 2, name: "Networking" })).toExist(),
      Scene.expect(Scene.text("What happens between an application write and another machine's read?")).toExist(),
      Scene.expect(Scene.role("link", { name: "10 Networking Selected" })).toHaveAttr("aria-current", "page"),
      Scene.expect(Scene.role("link", { name: "08 Operating systems Helps first" })).toHaveAttr("href", "/foundations/operating-systems/"),
      Scene.expect(Scene.role("link", { name: "02 Probability and statistics Helps first" })).toExist(),
      Scene.expect(Scene.role("link", { name: "12 Distributed systems Builds on it" })).toExist(),
      Scene.expect(Scene.role("link", { name: "13 Security Builds on it" })).toExist(),
      Scene.expect(Scene.role("link", { name: "16 Reliability and recovery Builds on it" })).toExist(),
      Scene.expect(Scene.text("Helps first", { exact: true })).toExist(),
      Scene.expect(Scene.role("link", { name: "Where does an observability trace go?" })).toExist(),
      Scene.expect(Scene.role("link", { name: /Next module 11 Databases, storage/ })).toHaveAttr("href", "/foundations/databases-storage/"),
    );
  });

  test("an internal link pushes history and browser back restores the earlier selection", () => {
    const next = update(modelAt("/foundations/networking/"), ClickedLink({
      request: Navigation.UrlRequest.Internal({ url: url("/foundations/security/") }),
    }));
    expect(next.commands).toMatchObject([{ name: Navigate.name, args: { href: "https://research.test/foundations/security/" } }]);
    Scene.scene({ update, view },
      Scene.given(modelAt("/foundations/networking/")),
      ...arrive("/foundations/security/"),
      Scene.expect(Scene.role("heading", { level: 2, name: "Security foundations" })).toExist(),
      ...arrive("/foundations/networking/"),
      Scene.expect(Scene.role("heading", { level: 2, name: "Networking" })).toExist(),
      Scene.Subscription.emit(ChangedUrl({ url: url("/foundations/") })),
      Scene.Command.resolve(FocusTarget, CompletedFocusTarget()),
      Scene.expect(Scene.role("heading", { level: 2, name: "Structure for coverage, curiosity for entry points" })).toExist(),
    );
  });

  test("a deep-linked module focuses its heading without forcing a scroll to the top", () => {
    expect(init(flags, url("/foundations/concurrency/")).commands).toMatchObject([
      { name: FocusFoundation.name, args: { id: detailHeadingId } },
    ]);
    Scene.scene({ update, view },
      Scene.given(modelAt("/foundations/concurrency/")),
      Scene.expect(Scene.role("heading", { level: 2, name: "Concurrency and parallelism" })).toExist(),
    );
  });

  test("a project route numbers its steps on the map and links each to a module", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/foundations/routes/docker-on-macos/")),
      Scene.expect(Scene.role("heading", { level: 2, name: "Why does Docker need a VM on macOS?" })).toExist(),
      Scene.expect(Scene.role("link", { name: "Why does Docker need a VM on macOS?" })).toHaveAttr("aria-current", "page"),
      Scene.expect(Scene.role("link", { name: "05 Representation and architecture Step 1" })).toExist(),
      Scene.expect(Scene.role("link", { name: "08 Operating systems Steps 2, 4" })).toExist(),
      Scene.expect(Scene.role("link", { name: "13 Security Step 3" })).toExist(),
      Scene.expect(Scene.role("link", { name: "Module 13 Security foundations" })).toHaveAttr("href", "/foundations/security/"),
      Scene.expect(Scene.text("Explain which kernel executes a container's syscalls and separate OS compatibility from instruction-set compatibility.")).toExist(),
      ...arrive("/foundations/routes/slow-query/"),
      Scene.expect(Scene.role("link", { name: "11 Databases and storage Steps 2, 3" })).toExist(),
      Scene.expect(Scene.role("link", { name: "15 Performance and experiments Step 4" })).toExist(),
    );
  });

  test("breadth areas are selectable and keep their connection back to systems", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/foundations/breadth/numerical-computing/")),
      Scene.expect(Scene.role("heading", { level: 2, name: "Scientific and numerical computing" })).toExist(),
      Scene.expect(Scene.text("When is a computed answer misleading even though the code has no obvious bug?")).toExist(),
      Scene.inside(Scene.selector(".fm-breadth"),
        Scene.expect(Scene.role("link", { name: "Scientific and numerical computing" })).toHaveAttr("aria-current", "page")),
    );
  });

  test("search lists matches with their context, survives selection, and clears from the empty state", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/foundations/")),
      Scene.type(Scene.label("Find a concept"), "TLS"),
      Scene.expect(Scene.role("status")).toHaveText("1 match for “TLS”"),
      Scene.expect(Scene.text("DNS, HTTP, TLS, proxies, load balancers, and connection reuse.")).toExist(),
      Scene.expect(Scene.role("link", { name: "10 Networking Match" })).toExist(),
      Scene.expect(Scene.selector('.fm-module.is-dimmed[href="/foundations/security/"]')).toExist(),
      ...arrive("/foundations/networking/"),
      Scene.expect(Scene.label("Find a concept")).toHaveValue("TLS"),
      Scene.expect(Scene.role("link", { name: "10 Networking Selected Match" })).toExist(),
      Scene.type(Scene.label("Find a concept"), "quantum gravity"),
      Scene.expect(Scene.role("status")).toHaveText("0 matches for “quantum gravity”"),
      Scene.click(Scene.role("button", { name: "Clear search" })),
      Scene.Command.expectExact(FocusFoundation({ id: foundationsQueryId })),
      Scene.Command.resolve(FocusFoundation, CompletedFocusFoundation()),
      Scene.expect(Scene.label("Find a concept")).toHaveValue(""),
      Scene.expect(Scene.role("button", { name: "Clear search" })).toBeAbsent(),
    );
  });

  test("search also reaches breadth areas and project routes", () => {
    Scene.scene({ update, view },
      Scene.given(modelAt("/foundations/")),
      Scene.type(Scene.label("Find a concept"), "idempotency"),
      Scene.inside(Scene.selector(".fm-results"),
        Scene.expect(Scene.role("link", { name: "12 Distributed systems" })).toExist(),
        Scene.expect(Scene.role("link", { name: "Why is this release or job duplicated?" })).toExist()),
      Scene.type(Scene.label("Find a concept"), "accessibility"),
      Scene.inside(Scene.selector(".fm-results"),
        Scene.expect(Scene.role("link", { name: "Human-computer interaction and accessibility" })).toExist()),
    );
  });

  test("unknown and over-deep paths fall back to a way back", () => {
    ["/foundations/not-a-module/", "/foundations/routes/nope/", "/foundations/networking/extra/"].forEach((path) => {
      Scene.scene({ update, view },
        Scene.given(modelAt(path)),
        Scene.expect(Scene.role("heading", { level: 2, name: "Not on this map." })).toExist(),
        Scene.expect(Scene.role("link", { name: "Back to the foundations map" })).toHaveAttr("href", "/foundations/"),
      );
    });
  });

  test("a fragment within a selection focuses that target instead of the detail heading", () => {
    expect(init(flags, url("/foundations/networking/#foundations-map")).commands).toMatchObject([
      { name: FocusTarget.name, args: { id: "foundations-map" } },
    ]);
  });
});
