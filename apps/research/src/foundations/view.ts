import { Match } from "effect";
import type { HtmlBuilder } from "foldkit/html";
import type { Message, Model } from "../app";
import { breadthDetail, missingDetail, moduleDetail, routeDetail } from "./detail-view";
import { moduleNumber, selectionFromPath } from "./map";
import type { Selection } from "./map";
import { mapView } from "./map-view";
import { overviewDetail } from "./overview-view";
import { searchView } from "./search-view";
import { sourcesId, sourcesView } from "./sources-view";
import "./styles.css";

export function foundationsTitle(path: string): string {
  const name = Match.value(selectionFromPath(path)).pipe(
    Match.tagsExhaustive({
      Overview: () => "A computer science foundations map",
      Module: ({ module }) => `${moduleNumber(module)} ${module.title} | CS foundations`,
      Route: ({ route }) => `${route.question} | CS foundations`,
      Breadth: ({ area }) => `${area.title} | CS foundations`,
      Missing: () => "Not on this map | CS foundations",
    }),
  );
  return `${name} | Guide Fari Research`;
}

export function foundationsView(model: Model, h: HtmlBuilder<Message>) {
  const selection = selectionFromPath(model.path);
  return h.div([h.Class("fm")], [
    h.header([h.Class("fm-intro")], [
      h.p([h.Class("eyebrow")], ["Interactive research / Computer science"]),
      h.h1([], ["A computer science foundations map"]),
      h.p([h.Class("fm-lede")], [
        "Sixteen study modules in four strands, from proof and probability to reliability, plus breadth beyond the systems emphasis. Strong systems engineering, grounded in computer science.",
      ]),
      h.p([h.Class("notice")], [
        "Agent-written curriculum proposal. A learning map, not a record of completed study, a degree-equivalence programme, or an official curriculum. ",
        h.a([h.Href(`#${sourcesId}`)], ["Sources and scope"]),
      ]),
    ]),
    h.div([h.Class("fm-layout")], [
      h.div([h.Class("fm-explore")], [
        searchView(model.foundationsQuery, h),
        mapView(selection, model.foundationsQuery, h),
      ]),
      h.div([h.Class("fm-panel")], [detailView(selection, h)]),
    ]),
    sourcesView(h),
  ]);
}

function detailView(selection: Selection, h: HtmlBuilder<Message>) {
  return Match.value(selection).pipe(
    Match.tagsExhaustive({
      Overview: () => overviewDetail(h),
      Module: ({ module }) => moduleDetail(module, h),
      Route: ({ route }) => routeDetail(route, h),
      Breadth: ({ area }) => breadthDetail(area, h),
      Missing: () => missingDetail(h),
    }),
  );
}
