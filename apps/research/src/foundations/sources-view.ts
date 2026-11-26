import type { HtmlBuilder } from "foldkit/html";
import type { Message } from "../app";
import { strands } from "./curriculum";

export const sourcesId = "foundations-sources";

const external = (href: string, label: string, h: HtmlBuilder<Message>) =>
  h.a([h.Href(href), h.Rel("noopener noreferrer")], [label]);

const breadthAreas = "Artificial Intelligence; Graphics and Interactive Techniques; Human-Computer Interaction; Specialized Platform Development; Society, Ethics, and the Profession";

export function sourcesView(h: HtmlBuilder<Message>) {
  return h.section([h.Id(sourcesId), h.Class("fm-sources"), h.AriaLabelledBy("fm-sources-title"), h.Tabindex(-1)], [
    h.h2([h.Id("fm-sources-title")], ["Sources and scope"]),
    h.p([], [
      "Researched on 26 November 2026. The grouping, study passes, experiments, project routes, and revisiting method are a study design, not an official ACM syllabus, a prescribed degree sequence, or a reconstruction of any earlier course.",
    ]),
    h.div([h.Class("fm-sources-grid")], [
      h.div([], [
        h.h3([], ["Coverage reference: CS2023"]),
        h.p([], [
          "The joint ACM/IEEE-CS/AAAI ",
          external("https://csed.acm.org/knowledge-areas/", "CS2023 knowledge-area index", h),
          " and ",
          external("https://csed.acm.org/final-report/", "final report", h),
          " supply the coverage check. Its 17 knowledge areas are not 17 compulsory courses in a fixed order; the report distinguishes shared CS Core from deeper study.",
        ]),
        h.div([h.Class("fm-table-scroll"), h.Tabindex(0), h.AriaLabelledBy("fm-areas-caption")], [
          h.table([h.Class("fm-table")], [
            h.caption([h.Id("fm-areas-caption")], ["Proposed strands and related CS2023 knowledge areas"]),
            h.thead([], [h.tr([], [
              h.th([h.Scope("col")], ["Proposed strand"]),
              h.th([h.Scope("col")], ["Related knowledge areas"]),
            ])]),
            h.tbody([], [
              ...strands.map((strand) => h.keyed("tr")(strand.id, [], [
                h.th([h.Scope("row")], [strand.title]),
                h.td([], [strand.knowledgeAreas.join("; ")]),
              ])),
              h.keyed("tr")("breadth", [], [
                h.th([h.Scope("row")], ["Deliberate breadth and recurring human concerns"]),
                h.td([], [breadthAreas]),
              ]),
            ]),
          ]),
        ]),
        h.p([h.Class("fm-quiet")], [
          "Performance and reliability are explicit modules because of the systems engineering goal. That is a study-design choice, not a claim that CS2023 names them as separate knowledge areas.",
        ]),
      ]),
      h.div([], [
        h.h3([], ["Structural comparison: MIT"]),
        h.p([], [
          "MIT's ",
          external("https://catalog.mit.edu/degree-charts/computer-science-engineering-course-6-3/", "2026/27 Computer Science and Engineering degree chart", h),
          " combines programming and software construction, mathematics for CS, algorithms, theory alternatives, systems alternatives, low-level C and assembly, computation structures, and further mathematics and track electives. It supports a mathematical and theoretical backbone, not just an operations syllabus. Its alternatives remain alternatives.",
        ]),
        h.p([], [
          "One possible later resource is ",
          external("https://pdos.csail.mit.edu/6.1810/2025/overview.html", "MIT's Fall 2025 Operating System Engineering", h),
          ", which teaches through extending the xv6 operating system. It is a dated course resource, not a claim of enrolment or access to MIT assessment.",
        ]),
      ]),
    ]),
  ]);
}
