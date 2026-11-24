import { Html, HtmlBuilder } from "foldkit/html";
import { ClickedContents, Message, Model } from "./app";
import { Report } from "./report";
import { readingPosition } from "./reader";

export function readerView(model: Model, report: Report, header: Html, h: HtmlBuilder<Message>) {
  const { index, chapter, previous, next } = readingPosition(report, model.anchor);
  if (!chapter) { return h.div([], [header, h.div([h.Class("prose"), h.InnerHTML(report.html)])]); }
  const expanded = model.contents === "Expanded";
  return h.div([h.Class("reader-layout")], [
    h.nav([h.Class(`contents ${expanded ? "is-expanded" : ""}`), h.AriaLabel("On this page")], [
      h.h2([h.Class("contents-title")], ["Reading map"]),
      h.button([
        h.Type("button"), h.Class("contents-toggle"), h.OnClick(ClickedContents()),
        h.AriaExpanded(expanded), h.AriaControls("chapter-map"),
      ], [`${index + 1} / ${report.chapters.length} · Reading map ${expanded ? "↑" : "↓"}`]),
      h.ol([h.Id("chapter-map")], report.chapters.map((entry) => h.keyed("li")(entry.slug, [], [
        h.a([
          h.Href(`#${entry.slug}`),
          h.AriaCurrent(entry.slug === chapter.slug ? "step" : "false"),
        ], [entry.title]),
      ]))),
    ]),
    h.div([h.Class("reader-main")], [
      header,
      h.section([h.Class("chapter"), h.AriaLabel("Current chapter")], [
        h.p([h.Class("chapter-label")], [`Chapter ${index + 1} / ${report.chapters.length}`, h.span([], [chapter.title])]),
        ...report.chapters.map((entry) => h.keyed("div")(entry.slug, [
          h.Class("prose chapter-content"), h.Hidden(entry.slug !== chapter.slug),
          ...(entry.slug === "reading-overview" ? [h.Id("reading-overview")] : []),
          h.Tabindex(-1), h.InnerHTML(report.html.slice(entry.start, entry.end)),
        ])),
        h.nav([h.Class("chapter-pagination"), h.AriaLabel("Chapter navigation")], [
          previous ? h.a([h.Href(`#${previous.slug}`)], [`← Previous: ${previous.title}`]) : h.span([]),
          next ? h.a([h.Href(`#${next.slug}`)], [`Next: ${next.title} →`]) : h.a([h.Href("/")], ["Back to library →"]),
        ]),
      ]),
    ]),
  ]);
}
