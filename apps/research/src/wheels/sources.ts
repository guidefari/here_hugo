import { Array, Option } from "effect";
import type { HtmlBuilder } from "foldkit/html";
import type { Message } from "../app";
import { chartSheet } from "./catalogue";
import type { Media, Wheel } from "./catalogue";
import { sourcesPanelId } from "./stage";

const external = (href: string, label: string, h: HtmlBuilder<Message>) =>
  h.a([h.Href(href), h.Target("_blank"), h.Rel("noopener noreferrer")], [label]);

export function sourcesPanel(selected: Option.Option<Wheel>, h: HtmlBuilder<Message>) {
  return h.div([
    h.Id(sourcesPanelId), h.Popover("auto"), h.Class("sources-panel"),
    h.Role("dialog"), h.AriaLabelledBy("sources-title"),
  ], [
    h.header([h.Class("sources-header")], [
      h.h2([h.Id("sources-title")], ["Sources and notes"]),
      h.button([
        h.Type("button"), h.Class("atlas-button"), h.Popovertarget(sourcesPanelId),
        h.Popovertargetaction("hide"),
      ], ["Close"]),
    ]),
    Option.match(selected, {
      onNone: () => h.empty,
      onSome: (wheel) => wheelSources(wheel, h),
    }),
    methodNotes(h),
  ]);
}

function wheelSources(wheel: Wheel, h: HtmlBuilder<Message>) {
  return h.section([h.AriaLabelledBy("sources-wheel")], [
    h.h3([h.Id("sources-wheel")], [`${wheel.label}: ${wheel.name}`]),
    h.p([], [wheel.reference, ". ", wheel.description]),
    Option.match(wheel.note, {
      onNone: () => h.empty,
      onSome: (note) => h.p([h.Class("sources-note")], [note.text, " ", external(note.source, "Identification evidence ↗", h)]),
    }),
    h.p([], [external(wheel.source, "Style catalogue page ↗", h)]),
    Array.match(wheel.media, {
      onEmpty: () => h.p([], ["No photograph has been verified for this position."]),
      onNonEmpty: (media) => h.ol([h.Class("sources-media")], media.map((entry) =>
        h.keyed("li")(entry.src, [], [mediaRecord(entry, h)]))),
    }),
  ]);
}

function mediaRecord(media: Media, h: HtmlBuilder<Message>) {
  const served = media.width === media.originalWidth && media.height === media.originalHeight
    ? `${media.width} × ${media.height}`
    : `${media.width} × ${media.height} served from ${media.originalWidth} × ${media.originalHeight}`;
  return h.div([], [
    h.p([h.Class("sources-media-title")], [media.kind === "OnCar" ? "On car: " : "Closeup: ", media.subject]),
    h.p([], [`${served}. ${media.processing}. ${media.match}. ${media.credit}. ${media.licence}.`]),
    h.p([], [external(media.sourcePage, "Source page ↗", h), " · ", external(media.original, "Original file ↗", h)]),
  ]);
}

function methodNotes(h: HtmlBuilder<Message>) {
  return h.section([h.AriaLabelledBy("sources-method")], [
    h.h3([h.Id("sources-method")], ["How to read this atlas"]),
    h.p([], [
      "The chart is the ", external(chartSheet.original, `original ${chartSheet.width} × ${chartSheet.height} sheet ↗`, h),
      ", shared by ", external(chartSheet.post, "@detta1z ↗", h),
      ". Its BMW catalogue attribution comes from the poster; the edition is unverified. Chart tiles are exact crops at that resolution.",
    ]),
    h.p([], ["Photographs are matched by eye against the chart crop: spoke count, geometry and visible construction. That establishes a design family, not factory fitment, OEM authenticity, finish or exact size. Cars are examples, not compatibility advice."]),
    h.p([], ["Nothing here was generated or upscaled by this project; large originals are only downscaled. Hosted product photographs were checked by eye, which cannot rule out retouching by their hosts. Unnumbered positions show candidates only where parts-catalogue evidence supports them."]),
    h.p([], ["Attribution is not a reuse licence. Unless a licence is stated for a photograph, no permission grant has been established by this research."]),
  ]);
}
