import { Array, Option } from "effect";
import type { HtmlBuilder } from "foldkit/html";
import type { Message } from "../app";
import { breadth, routes } from "./curriculum";
import type { BreadthArea, Module, ProjectRoute } from "./curriculum";
import {
  breadthHref, buildsOn, detailHeadingId, findModule, foundationsHref, helpfulFirst, moduleHref, moduleLabel,
  moduleNumber, neighbours, passesWith, routeHref, routesThrough, stepNumbers, strandOf,
} from "./map";
import { mapId } from "./map-view";

const title = (text: string, h: HtmlBuilder<Message>) =>
  h.h2([h.Id(detailHeadingId), h.Tabindex(-1), h.Class("fm-detail-title")], [text]);

const backToMap = (h: HtmlBuilder<Message>) =>
  h.a([h.Class("fm-back"), h.Href(`#${mapId}`)], ["Back to the map"]);

export function moduleDetail(module: Module, h: HtmlBuilder<Message>) {
  const strand = strandOf(module);
  return h.article([h.Class("fm-detail"), h.AriaLabelledBy(detailHeadingId)], [
    h.p([h.Class("fm-kicker")], [
      `Module ${moduleNumber(module)}`,
      Option.match(strand, { onNone: () => "", onSome: (entry) => ` · ${entry.title}` }),
    ]),
    title(module.title, h),
    h.p([h.Class("fm-question")], [h.span([], ["Central question"]), module.question]),
    h.h3([], ["Topics"]),
    h.ul([h.Class("fm-topics")], module.topics.map((topic) => h.keyed("li")(topic, [], [topic]))),
    h.h3([], ["Experiment"]),
    h.p([h.Class("fm-experiment")], [module.experiment]),
    h.section([h.Class("fm-connections"), h.AriaLabelledBy("fm-connections-title")], [
      h.h3([h.Id("fm-connections-title")], ["How it connects"]),
      h.h4([], ["Useful preparation"]),
      h.p([], [module.preparation]),
      moduleLinks("Helps first on this map", helpfulFirst(module), "Nothing else on the map is named as preparation.", h),
      moduleLinks("Builds on it", buildsOn(module), "No other module names this one as preparation.", h),
      routesThroughView(module, h),
      passesView(module, h),
      Option.match(strand, {
        onNone: () => h.empty,
        onSome: (entry) => h.p([h.Class("fm-areas")], [
          "Related CS2023 knowledge areas for this strand: ", entry.knowledgeAreas.join("; "), ".",
        ]),
      }),
    ]),
    pagerView(module, h),
    backToMap(h),
  ]);
}

function moduleLinks(heading: string, linked: ReadonlyArray<Module>, empty: string, h: HtmlBuilder<Message>) {
  return h.div([h.Class("fm-linked")], [
    h.h4([], [heading]),
    Array.match(linked, {
      onEmpty: () => h.p([h.Class("fm-quiet")], [empty]),
      onNonEmpty: (entries) => h.ul([h.Class("fm-link-list")], entries.map((entry) => h.keyed("li")(entry.id, [], [
        h.a([h.Href(moduleHref(entry))], [moduleLabel(entry)]),
      ]))),
    }),
  ]);
}

function routesThroughView(module: Module, h: HtmlBuilder<Message>) {
  return h.div([h.Class("fm-linked")], [
    h.h4([], ["Project routes through it"]),
    Array.match(routesThrough(module), {
      onEmpty: () => h.p([h.Class("fm-quiet")], ["None of the listed project routes passes through this module."]),
      onNonEmpty: (entries) => h.ul([h.Class("fm-link-list")], entries.map((route) => h.keyed("li")(route.id, [], [
        h.a([h.Href(routeHref(route))], [route.question]),
        h.span([h.Class("fm-quiet")], [` ${stepLabel(stepNumbers(route, module))}`]),
      ]))),
    }),
  ]);
}

function stepLabel(steps: ReadonlyArray<number>): string {
  return `${steps.length === 1 ? "step" : "steps"} ${steps.join(", ")}`;
}

function passesView(module: Module, h: HtmlBuilder<Message>) {
  return h.div([h.Class("fm-linked")], [
    h.h4([], ["In the study passes"]),
    Array.match(passesWith(module), {
      onEmpty: () => h.p([h.Class("fm-quiet")], ["Not named in a pass. Reach it through a project route or a related module."]),
      onNonEmpty: (entries) => h.ul([h.Class("fm-link-list")], entries.map((pass) => h.keyed("li")(`pass-${pass.number}`, [], [
        `Pass ${pass.number}: ${pass.title}`,
        pass.alongside.includes(module.id) && !pass.modules.includes(module.id)
          ? h.span([h.Class("fm-quiet")], [" (continued alongside)"])
          : h.empty,
      ]))),
    }),
  ]);
}

function pagerView(module: Module, h: HtmlBuilder<Message>) {
  const { previous, next } = neighbours(module);
  return h.nav([h.Class("fm-pager"), h.AriaLabel("Module sequence")], [
    Option.match(previous, {
      onNone: () => h.span([]),
      onSome: (entry) => h.a([h.Href(moduleHref(entry)), h.Class("fm-pager-previous")], [
        h.span([], ["Previous module"]), " ", h.strong([], [moduleLabel(entry)]),
      ]),
    }),
    Option.match(next, {
      onNone: () => h.span([]),
      onSome: (entry) => h.a([h.Href(moduleHref(entry)), h.Class("fm-pager-next")], [
        h.span([], ["Next module"]), " ", h.strong([], [moduleLabel(entry)]),
      ]),
    }),
  ]);
}

export function routeDetail(route: ProjectRoute, h: HtmlBuilder<Message>) {
  return h.article([h.Class("fm-detail"), h.AriaLabelledBy(detailHeadingId)], [
    h.p([h.Class("fm-kicker")], ["Project route"]),
    title(route.question, h),
    h.p([], ["Each step links to the module where this map studies the concept."]),
    h.ol([h.Class("fm-route")], route.steps.map((step, index) => h.keyed("li")(`${index}-${step.module}`, [], [
      h.span([h.Class("fm-route-step"), h.AriaHidden(true)], [`${index + 1}`]),
      h.div([], [
        h.strong([], [step.concept]),
        Option.match(findModule(step.module), {
          onNone: () => h.empty,
          onSome: (module) => h.a([h.Href(moduleHref(module))], [`Module ${moduleLabel(module)}`]),
        }),
      ]),
    ]))),
    h.h3([], ["Evidence of understanding"]),
    h.p([], [route.evidence]),
    h.p([h.Class("fm-note")], [
      "Projects test understanding; they do not establish coverage on their own. A working deployment can coexist with gaps in proof, algorithm analysis, or computer architecture.",
    ]),
    h.h3([], ["Other project questions"]),
    h.ul([h.Class("fm-link-list")], Array.filter(routes, (other) => other.id !== route.id).map((other) =>
      h.keyed("li")(other.id, [], [h.a([h.Href(routeHref(other))], [other.question])]))),
    backToMap(h),
  ]);
}

export function breadthDetail(area: BreadthArea, h: HtmlBuilder<Message>) {
  return h.article([h.Class("fm-detail"), h.AriaLabelledBy(detailHeadingId)], [
    h.p([h.Class("fm-kicker")], ["Breadth"]),
    title(area.title, h),
    h.dl([h.Class("fm-facts")], [
      h.dt([], ["An introductory foothold"]),
      h.dd([], [area.foothold]),
      h.dt([], ["Connection back to systems"]),
      h.dd([], [area.connection]),
    ]),
    h.p([], [
      "The systems emphasis determines depth, not the outer boundary of computer science. Breadth subjects deserve both explicit study and recurring questions inside the core modules. Pass 5 pairs one with a real question.",
    ]),
    h.h3([], ["Other breadth areas"]),
    h.ul([h.Class("fm-link-list")], Array.filter(breadth, (other) => other.id !== area.id).map((other) =>
      h.keyed("li")(other.id, [], [h.a([h.Href(breadthHref(other))], [other.title])]))),
    backToMap(h),
  ]);
}

export function missingDetail(h: HtmlBuilder<Message>) {
  return h.article([h.Class("fm-detail"), h.AriaLabelledBy(detailHeadingId)], [
    title("Not on this map.", h),
    h.p([], ["That module, route, or breadth area does not exist here."]),
    h.a([h.Href(foundationsHref)], ["Back to the foundations map"]),
  ]);
}
