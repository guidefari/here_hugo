import type { HtmlBuilder } from "foldkit/html";
import { ClickedWheelPhoto, ClickedWheelView } from "../app";
import type { Message } from "../app";
import { mediaOf } from "./catalogue";
import type { Media, MediaKind, Wheel } from "./catalogue";

export function imageViewSwitch(wheel: Wheel, selected: string, h: HtmlBuilder<Message>) {
  const option = (kind: MediaKind, label: string) => {
    const photos = mediaOf(wheel, kind);
    const preview = photos[0];
    return h.button([
      h.Type("button"), h.Class("view-option"),
      h.AriaLabel(`${label}, ${photos.length} ${photos.length === 1 ? "photograph" : "photographs"}`),
      h.AriaPressed(selected === kind ? "true" : "false"),
      h.Disabled(photos.length === 0),
      h.OnClick(ClickedWheelView({ view: kind })),
    ], [
      preview ? h.img([
        h.Src(preview.src), h.Alt(""), h.Width("48"), h.Height("40"), h.Decoding("async"),
      ]) : h.span([h.Class("view-preview-empty"), h.AriaHidden(true)], ["−"]),
      h.span([h.Class("view-option-label")], [
        h.span([], [label]),
        h.span([h.Class("view-count")], [photos.length === 0 ? "No photos yet" : `${photos.length} ${photos.length === 1 ? "photo" : "photos"}`]),
      ]),
    ]);
  };
  return h.div([h.Class("view-switch"), h.Role("group"), h.AriaLabel("Image view")], [
    option("Closeup", "Closeup"),
    option("OnCar", "On car"),
  ]);
}

export function photoNavigation(photos: ReadonlyArray<Media>, index: number, h: HtmlBuilder<Message>) {
  if (photos.length === 0) {
    return h.empty;
  }
  const start = Math.max(0, Math.min(index - 2, photos.length - 5));
  return h.div([h.Class("photo-navigation")], [
    h.p([h.Class("photo-position"), h.Role("status")], [`${index + 1} / ${photos.length}`]),
    photos.length > 1 ? h.div([h.Class("photo-picker"), h.Role("group"), h.AriaLabel("Photographs")], [
      h.button([
        h.Type("button"), h.Class("photo-step"), h.AriaLabel("Previous photograph"),
        h.OnClick(ClickedWheelPhoto({ index: (index - 1 + photos.length) % photos.length })),
      ], ["‹"]),
      h.div([h.Class("photo-previews")], photos.slice(start, start + 5).map((media, offset) =>
        h.keyed("button")(media.src, [
          h.Type("button"), h.Class("photo-preview"),
          h.AriaLabel(`View photograph ${start + offset + 1}`),
          h.AriaPressed(index === start + offset ? "true" : "false"),
          h.OnClick(ClickedWheelPhoto({ index: start + offset })),
        ], [
          h.img([h.Src(media.src), h.Alt(""), h.Width("52"), h.Height("40"), h.Decoding("async")]),
        ]))),
      h.button([
        h.Type("button"), h.Class("photo-step"), h.AriaLabel("Next photograph"),
        h.OnClick(ClickedWheelPhoto({ index: (index + 1) % photos.length })),
      ], ["›"]),
    ]) : h.empty,
    photos.length > 1 ? h.p([h.Class("stage-keys")], ["← → photos"]) : h.empty,
  ]);
}
