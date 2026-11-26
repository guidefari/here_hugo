import { Array, Match, String } from "effect";
import type { HtmlBuilder } from "foldkit/html";
import type { Message } from "../app";
import { breadth, routes, strands } from "./curriculum";
import type { BreadthArea, Module, ProjectRoute, Strand } from "./curriculum";
import {
  breadthHref, breadthMatches, moduleHref, moduleMatches, moduleNumber, modulesIn, normalizeQuery,
  relationTo, routeHref, stepNumbers,
} from "./map";
import type { Selection } from "./map";

export const mapId = "foundations-map";

type Tile = { readonly state: string; readonly marks: ReadonlyArray<string>; readonly isCurrent: boolean };

export function mapView(selection: Selection, query: string, h: HtmlBuilder<Message>) {
  return h.section([h.Id(mapId), h.Class("fm-map"), h.AriaLabelledBy("fm-map-heading"), h.Tabindex(-1)], [
    h.h2([h.Id("fm-map-heading"), h.Class("fm-band-title")], ["Sixteen modules in four strands"]),
    h.ul([h.Class("fm-strands")], strands.map((strand) => h.keyed("li")(strand.id, [
      h.Class(`fm-strand${isSelectedStrand(selection, strand) ? " is-active" : ""}`),
    ], [strandView(strand, selection, query, h)]))),
    legendView(selection, h),
    breadthBand(selection, query, h),
    routesBand(selection, h),
  ]);
}

function strandView(strand: Strand, selection: Selection, query: string, h: HtmlBuilder<Message>) {
  return h.div([h.Class("fm-strand-body")], [
    h.h3([h.Class("fm-strand-title")], [strand.title]),
    h.p([h.Class("fm-strand-purpose")], [strand.contribution]),
    h.ol([h.Class("fm-modules")], modulesIn(strand).map((module) => {
      const tile = moduleTile(module, selection, query);
      return h.keyed("li")(module.id, [], [
        h.a([
          h.Href(moduleHref(module)),
          h.Class(`fm-module ${tile.state}`),
          h.AriaCurrent(tile.isCurrent ? "page" : "false"),
        ], [
          h.span([h.Class("fm-module-number")], [moduleNumber(module)]),
          " ",
          h.span([h.Class("fm-module-name")], [module.short]),
          " ",
          marksView(tile.marks, h),
        ]),
      ]);
    })),
  ]);
}

function marksView(marks: ReadonlyArray<string>, h: HtmlBuilder<Message>) {
  return Array.match(marks, {
    onEmpty: () => h.empty,
    onNonEmpty: (labels) => h.span([h.Class("fm-marks")], Array.intersperse(labels.map((label) => h.span([h.Class("fm-mark")], [label])), " ")),
  });
}

function moduleTile(module: Module, selection: Selection, query: string): Tile {
  const searching = String.isNonEmpty(normalizeQuery(query));
  const matched = moduleMatches(module, query);
  const searchMarks = matched ? ["Match"] : [];
  const searchState = searching && !matched ? " is-dimmed" : "";
  return Match.value(selection).pipe(
    Match.withReturnType<Tile>(),
    Match.tagsExhaustive({
      Module: ({ module: selected }) => {
        const relation = relationTo(selected, module);
        return {
          state: `is-${relation.toLowerCase()}${searchState}`,
          marks: [...relationMarks(relation), ...searchMarks],
          isCurrent: relation === "Selected",
        };
      },
      Route: ({ route }) => {
        const steps = stepNumbers(route, module);
        return {
          state: `${Array.isReadonlyArrayNonEmpty(steps) ? "is-on-route" : "is-unrelated"}${searchState}`,
          marks: [...stepMarks(steps), ...searchMarks],
          isCurrent: false,
        };
      },
      Overview: () => ({ state: `is-neutral${searchState}`, marks: searchMarks, isCurrent: false }),
      Breadth: () => ({ state: `is-neutral${searchState}`, marks: searchMarks, isCurrent: false }),
      Missing: () => ({ state: `is-neutral${searchState}`, marks: searchMarks, isCurrent: false }),
    }),
  );
}

function relationMarks(relation: ReturnType<typeof relationTo>): ReadonlyArray<string> {
  return Match.value(relation).pipe(
    Match.withReturnType<ReadonlyArray<string>>(),
    Match.when("Selected", () => ["Selected"]),
    Match.when("HelpsFirst", () => ["Helps first"]),
    Match.when("BuildsOn", () => ["Builds on it"]),
    Match.when("Unrelated", () => []),
    Match.exhaustive,
  );
}

function stepMarks(steps: ReadonlyArray<number>): ReadonlyArray<string> {
  return Array.match(steps, {
    onEmpty: () => [],
    onNonEmpty: (numbers) => [`${numbers.length === 1 ? "Step" : "Steps"} ${numbers.join(", ")}`],
  });
}

function isSelectedStrand(selection: Selection, strand: Strand): boolean {
  return selection._tag === "Module" && selection.module.strand === strand.id;
}

function legendView(selection: Selection, h: HtmlBuilder<Message>) {
  return h.div([h.Class("fm-legend")], [
    Match.value(selection).pipe(
      Match.tagsExhaustive({
        Module: () => h.p([], [
          h.strong([], ["Helps first"]), " marks useful preparation named by the selected module, not a gate. ",
          h.strong([], ["Builds on it"]), " marks modules that name the selected one as useful preparation.",
        ]),
        Route: () => h.p([], ["Step numbers follow the project question through the modules where this map studies each concept."]),
        Overview: () => h.p([], ["Numbers are stable references, not a compulsory teaching order. Select a module to see what helps first and what builds on it."]),
        Breadth: () => h.p([], ["Numbers are stable references, not a compulsory teaching order."]),
        Missing: () => h.p([], ["Numbers are stable references, not a compulsory teaching order."]),
      }),
    ),
  ]);
}

function breadthBand(selection: Selection, query: string, h: HtmlBuilder<Message>) {
  const searching = String.isNonEmpty(normalizeQuery(query));
  return h.div([h.Class("fm-band")], [
    h.h3([h.Id("fm-breadth-title"), h.Class("fm-band-title")], ["Breadth beyond the systems emphasis"]),
    h.ul([h.Class("fm-breadth")], breadth.map((area) => {
      const matched = breadthMatches(area, query);
      return h.keyed("li")(area.id, [], [
        h.a([
          h.Href(breadthHref(area)),
          h.Class(`fm-chip${searching && !matched ? " is-dimmed" : ""}`),
          h.AriaCurrent(isSelectedBreadth(selection, area) ? "page" : "false"),
        ], [area.title, matched ? " " : "", matched ? h.span([h.Class("fm-mark")], ["Match"]) : h.empty]),
      ]);
    })),
  ]);
}

function isSelectedBreadth(selection: Selection, area: BreadthArea): boolean {
  return selection._tag === "Breadth" && selection.area.id === area.id;
}

function routesBand(selection: Selection, h: HtmlBuilder<Message>) {
  return h.div([h.Class("fm-band")], [
    h.h3([h.Class("fm-band-title")], ["Start from a project question"]),
    h.ul([h.Class("fm-routes")], routes.map((route) => h.keyed("li")(route.id, [], [
      h.a([
        h.Href(routeHref(route)),
        h.Class("fm-route-link"),
        h.AriaCurrent(isSelectedRoute(selection, route) ? "page" : "false"),
      ], [route.question]),
    ]))),
  ]);
}

function isSelectedRoute(selection: Selection, route: ProjectRoute): boolean {
  return selection._tag === "Route" && selection.route.id === route.id;
}
