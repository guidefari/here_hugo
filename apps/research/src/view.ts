import { Array } from "effect";
import { Document, HtmlBuilder } from "foldkit/html";
import { ChangedQuery, Message, Model } from "./app";
import { Report, formatDate } from "./report";
import { readerView } from "./reader-view";
import { moodboardView } from "./moodboard/view";

export function view(model: Model, h: HtmlBuilder<Message>): Document {
  if (model.path.replace(/\/$/, "") === "/moodboard") {
    return {
      title: "Judging books by their covers (jk jk)",
      body: h.main([h.Id("main-content"), h.Tabindex(-1), h.Class("immersive-host")], [
        moodboardView(model.anchor, h),
      ]),
    };
  }
  const report = model.reports.find((entry) => `/reports/${entry.id}/` === `${model.path.replace(/\/$/, "")}/`);
  return {
    title: `${report?.title ?? "Research library"} | Guide Fari Research`,
    body: h.div([], [
      h.header([h.Class("site-header")], [
        h.a([h.Class("skip-link"), h.Href("#main-content")], ["Skip to content"]),
        h.a([h.Class("brand"), h.Href("/")], ["Guide Fari ", h.span([], ["Research"])]),
        h.nav([h.AriaLabel("Primary")], [
          h.a([h.Href("/")], ["Library"]),
          h.a([h.Href("/moodboard/")], ["Moodboard"]),
          h.a([h.Href("/rss.xml")], ["RSS"]),
          h.a([h.Href("https://guidefari.com")], ["Main blog ↗"]),
        ]),
      ]),
      h.main([h.Id("main-content"), h.Tabindex(-1), h.Class(report ? "report-page" : "library-page")], [
        pageView(model, report, h),
      ]),
      h.footer([h.Class("site-footer")], [
        h.p([], ["Agent-generated research, collected by ", h.a([h.Href("https://guidefari.com")], ["Guide Fari"]), "."]),
        h.p([], ["Research notes, not finished articles. Follow the sources and check the dates."]),
      ]),
    ]),
  };
}

function pageView(model: Model, report: Report | undefined, h: HtmlBuilder<Message>) {
  if (model.path === "/") return libraryView(model, h);
  if (report) return reportView(model, report, h);
  return h.section([h.Class("intro")], [
    h.h1([], ["Not on this shelf."]),
    h.a([h.Href("/")], ["Back to the research library"]),
  ]);
}

function libraryView(model: Model, h: HtmlBuilder<Message>) {
  const reports = model.reports.filter((report) => !report.parent);
  const visible = reports.filter((report) =>
    `${report.title} ${report.description} ${report.tags.join(" ")}`.toLowerCase().includes(model.query.trim().toLowerCase()));
  return h.div([], [
    h.section([h.Class("intro")], [
      h.p([h.Class("eyebrow")], ["The research shelf"]),
      h.h1([], ["A place to read the research."]),
      h.p([h.Class("lede")], ["Evidence, source notes, and open questions from my agents. Kept separate from the articles I write myself."]),
    ]),
    h.section([h.Class("moodboard-entry"), h.AriaLabelledBy("moodboard-heading")], [
      h.div([], [
        h.p([h.Class("eyebrow")], ["Visual research"]),
        h.h2([h.Id("moodboard-heading")], [
          h.a([h.Href("/moodboard/")], ["Judging books by their covers (jk jk)"]),
        ]),
        h.p([], ["An interactive cover moodboard."]),
      ]),
      h.a([h.Href("/moodboard/"), h.Class("moodboard-entry-covers"), h.AriaLabel("Explore the cover moodboard")], [
        ...["cover-1", "cover-4", "cover-9"].map((id) => h.keyed("img")(id, [
          h.Src(`/moodboard/${id}.jpg`), h.Alt(""), h.Loading("lazy"),
        ])),
      ]),
    ]),
    h.section([h.AriaLabelledBy("reports-heading")], [
      h.div([h.Class("section-heading")], [
        h.h2([h.Id("reports-heading")], ["Research library"]),
        h.span([h.Role("status")], [`${visible.length} of ${reports.length} reports`]),
      ]),
      h.label([h.For("library-query")], ["Find a report"]),
      h.input([
        h.Id("library-query"), h.Type("search"), h.Value(model.query),
        h.OnInput((value) => ChangedQuery({ value })),
      ]),
      ...visible.map((report) => h.keyed("article")(report.id, [h.Class("report-card")], [
        h.p([h.Class("eyebrow")], [formatDate(report.date), " · Agent-generated"]),
        h.h2([], [h.a([h.Href(`/reports/${report.id}/`)], [report.title])]),
        h.p([], [report.description]),
        tagsView(report, h),
      ])),
      Array.match(visible, {
        onEmpty: () => h.p([h.Class("empty-state")], ["No matching reports. Try another title or topic."]),
        onNonEmpty: () => h.empty,
      }),
    ]),
  ]);
}

function reportView(model: Model, report: Report, h: HtmlBuilder<Message>) {
  const parent = model.reports.find((entry) => entry.id === report.parent);
  const supporting = model.reports.filter((entry) => entry.parent === report.id)
    .sort((a, b) => a.title.localeCompare(b.title));
  return h.article([], [
    h.header([h.Class("report-header")], [
      h.a([h.Href("/")], ["← Research library"]),
      parent ? h.p([], [h.a([h.Href(`/reports/${parent.id}/`)], [`Part of: ${parent.title}`])]) : h.empty,
      h.p([h.Class("eyebrow")], [`Agent-generated research · ${formatDate(report.date)}`]),
      h.h1([], [report.title]),
      h.p([h.Class("lede")], [report.description]),
      report.updated ? h.p([], [`Updated ${formatDate(report.updated)}`]) : h.empty,
      tagsView(report, h),
      h.p([h.Class("notice")], ["Generated with AI assistance. Claims may be incomplete or out of date. Check the linked sources before relying on them."]),
    ]),
    readerView(model, report, h),
    Array.match(supporting, {
      onEmpty: () => h.empty,
      onNonEmpty: (notes) => h.details([h.Class("supporting-notes")], [
        h.summary([], [`Supporting research (${notes.length} notes)`]),
        h.ul([], notes.map((note) => h.keyed("li")(note.id, [], [
          h.a([h.Href(`/reports/${note.id}/`)], [note.title]),
        ]))),
      ]),
    }),
  ]);
}

function tagsView(report: Report, h: HtmlBuilder<Message>) {
  return Array.match(report.tags, {
    onEmpty: () => h.empty,
    onNonEmpty: (tags) => h.ul([h.Class("tags"), h.AriaLabel("Topics")],
      tags.map((tag) => h.keyed("li")(tag, [], [tag]))),
  });
}
