import { Array, Option, Result } from "effect";
import type { HtmlBuilder } from "foldkit/html";
import type { Message } from "../app";
import { openDecisions, passes, topicRecord } from "./curriculum";
import type { StudyPass } from "./curriculum";
import { detailHeadingId, findModule, moduleHref, moduleNumber } from "./map";

export function overviewDetail(h: HtmlBuilder<Message>) {
  return h.article([h.Class("fm-detail is-overview"), h.AriaLabelledBy(detailHeadingId)], [
    h.p([h.Class("fm-kicker")], ["How to use it"]),
    h.h2([h.Id(detailHeadingId), h.Tabindex(-1), h.Class("fm-detail-title")], ["Structure for coverage, curiosity for entry points"]),
    h.p([], [
      "Pick a module to see its central question, topics, and an experiment, then follow what helps first and what builds on it. Or start from a project question and walk its route through the concepts.",
    ]),
    h.p([], [
      "A project can send you into an operating-systems question without a semester of maths first. The map keeps the missing foundations visible instead of quietly dropping them.",
    ]),
    h.h3([], ["Five passes, revisited at greater depth"]),
    h.ol([h.Class("fm-passes")], passes.map((pass) => h.keyed("li")(`pass-${pass.number}`, [], [passView(pass, h)]))),
    h.p([h.Class("fm-note")], [
      "A project question can move a topic forward. Record the prerequisite it exposes and return to it, rather than finishing three textbooks before continuing.",
    ]),
    h.h3([], ["Keep one small record per topic"]),
    h.dl([h.Class("fm-facts is-compact")], topicRecord.flatMap(([term, description]) => [
      h.dt([], [term]), h.dd([], [description]),
    ])),
    h.p([h.Class("fm-quiet")], [
      "A lightweight status such as unexplored, recognizable, explainable, or applied, with a date and evidence, works as a learning signal, not a certification. This page records no progress.",
    ]),
    h.h3([], ["Decisions still open"]),
    h.ul([], openDecisions.map((decision) => h.keyed("li")(decision, [], [decision]))),
  ]);
}

function passView(pass: StudyPass, h: HtmlBuilder<Message>) {
  return h.div([h.Class("fm-pass")], [
    h.strong([], [pass.title]),
    h.p([], [pass.summary]),
    h.ul([h.Class("fm-pass-modules"), h.AriaLabel(`Modules in pass ${pass.number}`)], [
      ...moduleChips(pass.modules, "", h),
      ...moduleChips(pass.alongside, " alongside", h),
      pass.includesBreadth ? h.keyed("li")("breadth", [], [h.a([h.Href("#fm-breadth-title"), h.Class("fm-chip is-small")], ["A breadth area"])]) : h.empty,
    ]),
  ]);
}

function moduleChips(ids: ReadonlyArray<string>, suffix: string, h: HtmlBuilder<Message>) {
  return Array.filterMap(ids, (id) => Option.match(findModule(id), {
    onNone: () => Result.failVoid,
    onSome: (module) => Result.succeed(h.keyed("li")(`${module.id}${suffix}`, [], [
      h.a([h.Href(moduleHref(module)), h.Class(`fm-chip is-small${suffix ? " is-alongside" : ""}`)], [
        `${moduleNumber(module)} ${module.short}${suffix}`,
      ]),
    ])),
  }));
}
