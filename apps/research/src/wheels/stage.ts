import { Array, Match, Option } from "effect";
import type { HtmlBuilder, KeyboardModifiers } from "foldkit/html";
import { PressedWheelKey, PressedWheelPhotoKey } from "../app";
import type { Message, WheelView } from "../app";
import { catalogue, featuredPost, featuredQuote, featuredWheel, mediaOf, wheelHref } from "./catalogue";
import type { Media, Wheel } from "./catalogue";
import { imageViewSwitch, photoNavigation } from "./gallery-controls";

export const sourcesPanelId = "atlas-sources";

type ResolvedView = Exclude<WheelView, "Auto"> | "Chart";

export function resolveView(wheel: Wheel, requested: WheelView): ResolvedView {
  const available = (view: Exclude<WheelView, "Auto">) =>
    Array.isReadonlyArrayNonEmpty(mediaOf(wheel, view));
  if (requested !== "Auto" && available(requested)) {
    return requested;
  }
  return Option.getOrElse(
    Array.findFirst(["Closeup", "OnCar"] satisfies ReadonlyArray<Exclude<WheelView, "Auto">>, available),
    () => "Chart",
  );
}

export function overviewStage(h: HtmlBuilder<Message>) {
  const hero = featuredWheel.media[0];
  return h.main([h.Id("main-content"), h.Class("atlas-stage is-overview"), h.Tabindex(-1)], [
    hero ? h.img([
      h.Class("overview-hero"), h.Src(hero.src), h.Alt(hero.subject),
      h.Width(String(hero.width)), h.Height(String(hero.height)), h.Fetchpriority("high"),
    ]) : h.empty,
    h.div([h.Class("overview-copy")], [
      h.p([h.Class("atlas-kicker")], ["Visual study / BMW wheels"]),
      h.h1([h.Id("atlas-title"), h.Tabindex(-1)], ["All stylings at a glance."]),
      h.blockquote([h.Class("overview-quote")], [
        h.p([], [`“${featuredQuote}”`]),
        h.footer([], [h.a([h.Href(featuredPost), h.Target("_blank"), h.Rel("noopener noreferrer")], ["@brenzgarage ↗"])]),
      ]),
      h.div([h.Class("overview-actions")], [
        h.a([h.Href(wheelHref(featuredWheel)), h.Class("atlas-button is-primary")], ["Study the CSL"]),
        h.p([h.Class("overview-hint")], ["Or pick any of the 63 catalogue positions from the chart."]),
      ]),
    ]),
  ]);
}

export function wheelStage(wheel: Wheel, requested: WheelView, photo: number, h: HtmlBuilder<Message>) {
  const view = resolveView(wheel, requested);
  const photos = view === "Chart" ? [] : mediaOf(wheel, view);
  const index = Array.isReadonlyArrayNonEmpty(photos) ? ((photo % photos.length) + photos.length) % photos.length : 0;
  const current = Array.get(photos, index);
  return h.main([
    h.Id("main-content"), h.Class("atlas-stage"), h.Tabindex(-1),
    h.AriaLabelledBy("atlas-title"),
    h.OnKeyDownPreventDefault((key, modifiers) => stageKey(key, modifiers, index, photos.length)),
  ], [
    stageHeader(wheel, h),
    imageViewSwitch(wheel, view, h),
    h.figure([h.Class(`stage-figure is-${view.toLowerCase()}`)], [
      Option.match(current, {
        onNone: () => chartFigure(wheel, h),
        onSome: (media) => photoFigure(media, h),
      }),
      Option.match(current, {
        onNone: () => chartCaption(wheel, h),
        onSome: (media) => photoCaption(media, h),
      }),
    ]),
    photoNavigation(photos, index, h),
  ]);
}

function stageHeader(wheel: Wheel, h: HtmlBuilder<Message>) {
  const position = catalogue.findIndex((entry) => entry.id === wheel.id);
  const previous = Array.get(catalogue, (position - 1 + catalogue.length) % catalogue.length);
  const next = Array.get(catalogue, (position + 1) % catalogue.length);
  return h.header([h.Class("stage-header")], [
    h.a([h.Href("/wheels/"), h.Class("atlas-button"), h.AriaKeyshortcuts("Escape")], ["← Overview"]),
    h.div([h.Class("stage-title")], [
      h.p([h.Class("atlas-kicker")], [wheel.label, " · ", h.span([h.Class(`id-badge is-${wheel.identification.toLowerCase()}`)], [identificationLabel(wheel)])]),
      h.h1([h.Id("atlas-title"), h.Tabindex(-1)], [wheel.name]),
      h.p([h.Class("stage-meta")], [wheel.family, " · ", wheel.models || "Applications not established"]),
    ]),
    h.nav([h.Class("stage-adjacent"), h.AriaLabel("Adjacent wheels")], [
      ...Option.toArray(Option.map(previous, (entry) => h.a([
        h.Href(wheelHref(entry)), h.Class("atlas-button is-icon"), h.AriaLabel(`Previous wheel: ${entry.label}`),
      ], ["‹"]))),
      ...Option.toArray(Option.map(next, (entry) => h.a([
        h.Href(wheelHref(entry)), h.Class("atlas-button is-icon"), h.AriaLabel(`Next wheel: ${entry.label}`),
      ], ["›"]))),
    ]),
  ]);
}

function identificationLabel(wheel: Wheel): string {
  return Match.value(wheel.identification).pipe(
    Match.when("Printed", () => "Printed style number"),
    Match.when("Candidate", () => "Unnumbered, candidate only"),
    Match.when("Unresolved", () => "Unnumbered, unresolved"),
    Match.when("Reference", () => "Extra reference"),
    Match.exhaustive,
  );
}

function photoFigure(media: Media, h: HtmlBuilder<Message>) {
  return h.div([h.Class("stage-image")], [
    h.keyed("img")(media.src, [
      h.Src(media.src), h.Alt(`${media.subject}. ${media.match}.`),
      h.Width(String(media.width)), h.Height(String(media.height)),
      h.Style({ maxInlineSize: `min(100% - 1.5rem, ${media.width}px)`, maxBlockSize: `min(100% - 1.5rem, ${media.height}px)` }),
      h.Decoding("async"),
    ]),
  ]);
}

function chartFigure(wheel: Wheel, h: HtmlBuilder<Message>) {
  return h.div([h.Class("stage-image is-chart")], [
    h.img([h.Src(wheel.tile), h.Alt(`Original chart crop: ${wheel.alt}`), h.Width("71"), h.Height("88")]),
  ]);
}

function chartCaption(wheel: Wheel, h: HtmlBuilder<Message>) {
  const message = Array.isReadonlyArrayEmpty(wheel.media)
    ? "No verified photograph for this position. Shown is the original chart crop, 71 × 88 px, enlarged."
    : "Original chart crop, 71 × 88 px, enlarged. Not a higher-resolution image.";
  return h.figcaption([h.Class("stage-caption")], [
    h.p([], [message]),
    h.p([h.Class("caption-detail")], [wheel.reference]),
  ]);
}

function photoCaption(media: Media, h: HtmlBuilder<Message>) {
  const lowResolution = Math.max(media.originalWidth, media.originalHeight) < 800;
  return h.figcaption([h.Class("stage-caption")], [
    h.p([], [
      media.subject,
    ]),
    h.p([h.Class("caption-detail")], [
      h.span([h.Class(`match-badge is-${media.match === "Visual match" ? "match" : "caution"}`)], [media.match]),
      ` ${media.originalWidth} × ${media.originalHeight}`,
      lowResolution ? h.strong([], [" · low resolution"]) : h.empty,
      " · ",
      h.a([h.Href(media.sourcePage), h.Target("_blank"), h.Rel("noopener noreferrer")], [`${media.credit} ↗`]),
      media.licence.startsWith("CC") ? ` · ${media.licence}` : h.empty,
    ]),
  ]);
}

function stageKey(key: string, modifiers: KeyboardModifiers, index: number, count: number): Option.Option<Message> {
  if (modifiers.altKey || modifiers.ctrlKey || modifiers.metaKey || modifiers.shiftKey) {
    return Option.none();
  }
  if (key === "Escape") {
    return Option.some(PressedWheelKey({ href: "/wheels/" }));
  }
  if (count < 2) {
    return Option.none();
  }
  if (key === "ArrowLeft") {
    return Option.some(PressedWheelPhotoKey({ index: (index - 1 + count) % count }));
  }
  if (key === "ArrowRight") {
    return Option.some(PressedWheelPhotoKey({ index: (index + 1) % count }));
  }
  return Option.none();
}
