import { Html, HtmlBuilder } from "foldkit/html";
import { ClickedContents, Message, Model } from "./app";
import { Report } from "./report";
import { readingPosition } from "./reader";

export type HeaderVariant = "Full" | "Compact";
type Chapter = Report["chapters"][number];

export function readerView(model: Model, report: Report, header: (variant: HeaderVariant) => Html, h: HtmlBuilder<Message>) {
  const { index, chapter, previous, next } = readingPosition(report, model.anchor);
  if (!chapter) { return h.div([], [header("Full"), h.div([h.Class("prose"), h.InnerHTML(report.html)])]); }
  return h.div([h.Class("reader-layout")], [
    contentsView(report, index, chapter, model.contents === "Expanded", h),
    h.div([h.Class("reader-main")], [
      header(index === 0 ? "Full" : "Compact"),
      h.section([h.Class("chapter"), h.AriaLabel("Current chapter")], [
        progressView(report, index, h),
        ...report.chapters.map((entry) => h.keyed("div")(entry.slug, [
          h.Class("prose chapter-content"), h.Hidden(entry.slug !== chapter.slug),
          ...(entry.slug === "reading-overview" ? [h.Id("reading-overview")] : []),
          h.Tabindex(-1), h.InnerHTML(report.html.slice(entry.start, entry.end)),
        ])),
        paginationView(previous, next, h),
      ]),
    ]),
  ]);
}

function contentsView(report: Report, index: number, chapter: Chapter, expanded: boolean, h: HtmlBuilder<Message>) {
  return h.nav([h.Class(`contents ${expanded ? "is-expanded" : ""}`), h.AriaLabel("On this page")], [
    h.h2([h.Class("contents-title")], ["Reading map"]),
    h.button([
      h.Type("button"), h.Class("contents-toggle"), h.OnClick(ClickedContents()),
      h.AriaExpanded(expanded), h.AriaControls("chapter-map"),
      h.AriaLabel(`Reading map, chapter ${index + 1} of ${report.chapters.length}: ${chapter.title}`),
    ], [
      h.span([h.Class("contents-toggle-count")], [`${index + 1} / ${report.chapters.length}`]),
      h.span([h.Class("contents-toggle-title")], [chapter.title]),
      h.span([h.Class("contents-toggle-action")], ["Reading map"]),
    ]),
    h.ol([h.Id("chapter-map")], report.chapters.map((entry) => h.keyed("li")(entry.slug, [], [
      h.a([
        h.Href(`#${entry.slug}`),
        h.AriaCurrent(entry.slug === chapter.slug ? "step" : "false"),
      ], [entry.title]),
    ]))),
  ]);
}

function progressView(report: Report, index: number, h: HtmlBuilder<Message>) {
  return h.div([h.Class("chapter-progress")], [
    h.p([], [`Chapter ${index + 1} of ${report.chapters.length}`]),
    h.ol([h.AriaHidden(true)], report.chapters.map((entry, position) => h.keyed("li")(entry.slug, [
      h.Class(progressState(position, index)),
    ]))),
  ]);
}

function progressState(position: number, current: number) {
  if (position < current) { return "is-read"; }
  if (position === current) { return "is-current"; }
  return "is-unread";
}

function paginationView(previous: Chapter | undefined, next: Chapter | undefined, h: HtmlBuilder<Message>) {
  return h.nav([h.Class("chapter-pagination"), h.AriaLabel("Chapter navigation")], [
    previous
      ? h.a([h.Href(`#${previous.slug}`), h.Class("chapter-previous"), h.AriaLabel(`Previous chapter: ${previous.title}`)], [
        h.span([], ["← Previous"]), h.strong([], [previous.title]),
      ])
      : h.span([]),
    next
      ? h.a([h.Href(`#${next.slug}`), h.Class("chapter-next"), h.AriaLabel(`Next chapter: ${next.title}`)], [
        h.span([], ["Next chapter →"]), h.strong([], [next.title]),
      ])
      : h.a([h.Href("/"), h.Class("chapter-next")], [h.span([], ["Finished"]), h.strong([], ["Back to the library"])]),
  ]);
}
