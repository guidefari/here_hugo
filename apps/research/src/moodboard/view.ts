import { Option } from "effect";
import type { HtmlBuilder, KeyboardModifiers } from "foldkit/html";
import { PressedCoverArrow } from "../app";
import type { Message } from "../app";
import { covers, paletteCss, selectedCover } from "./covers";
import type { Cover } from "./covers";
import "./styles.css";

export function moodboardView(anchor: string, h: HtmlBuilder<Message>) {
  const cover = selectedCover(anchor);
  const index = covers.findIndex((entry) => entry.id === cover.id);
  const previous = covers.at((index + covers.length - 1) % covers.length) ?? covers[0];
  const next = covers.at((index + 1) % covers.length) ?? covers[0];
  return h.div([
    h.Class("cover-room"), h.Id(cover.id), h.Tabindex(-1),
    h.Style({
      "--room-field": cover.palette[0]?.hex ?? "#3C4435",
      "--room-ink": cover.ink,
      "--room-accent": cover.palette[1]?.hex ?? "#BEA962",
    }),
    h.OnKeyDownPreventDefault((key, modifiers) => arrowMessage(key, modifiers, previous, next)),
  ], [
    h.header([h.Class("room-header")], [
      h.h1([], ["Judging books by their covers ", h.span([], ["(jk jk)"])]),
      h.a([h.Href("/"), h.Class("room-exit")], ["Library ↗"]),
    ]),
    coverDock(cover, previous, next, h),
    h.section([h.Class("room-stage"), h.AriaLabel("Focused cover")], [
      h.div([h.Class("room-slides")], covers.map((entry, entryIndex) =>
        h.keyed("div")(entry.id, [
          h.Class(`room-slide${entry.id === cover.id ? " is-active" : ""}`),
          h.Style({ "--slide-offset": `${(entryIndex - index) * 28}px` }),
          h.AriaHidden(entry.id !== cover.id), h.Inert(entry.id !== cover.id),
        ], [
          h.a([
            h.Href(`/moodboard/${entry.id}.jpg`), h.Target("_blank"), h.Rel("noopener"),
            h.AriaLabel(`Open full-size cover: ${entry.title}`),
          ], [h.img([
            h.Src(`/moodboard/${entry.id}.jpg`), h.Alt(entry.alt),
            h.Decoding("async"), h.Loading("eager"),
          ])]),
        ]))),
      h.div([h.Class("room-caption"), h.Role("status")], [
        h.h2([h.Id("active-cover-title")], [cover.title]),
        h.p([], [cover.author]),
      ]),
    ]),
    paletteView(cover, h),
    h.footer([h.Class("room-footer")], [
      h.a([
        h.Href(`https://x.com/BookNoteApp/status/2124639562773520461/photo/${cover.photo}`),
        h.Target("_blank"), h.Rel("noopener noreferrer"),
      ], ["Original cover ↗"]),
      h.span([h.Class("room-keyboard-hint")], ["↑ ↓ or ← → to explore"]),
      h.span([], [`0${index + 1} / 0${covers.length}`]),
    ]),
  ]);
}

function arrowMessage(key: string, modifiers: KeyboardModifiers, previous: Cover, next: Cover): Option.Option<Message> {
  if (modifiers.altKey || modifiers.ctrlKey || modifiers.metaKey || modifiers.shiftKey) {
    return Option.none();
  }
  if (key === "ArrowLeft" || key === "ArrowUp") {
    return Option.some(PressedCoverArrow({ href: `/moodboard/#${previous.id}` }));
  }
  if (key === "ArrowRight" || key === "ArrowDown") {
    return Option.some(PressedCoverArrow({ href: `/moodboard/#${next.id}` }));
  }
  return Option.none();
}

function coverDock(cover: Cover, previous: Cover, next: Cover, h: HtmlBuilder<Message>) {
  return h.nav([h.Class("cover-dock"), h.AriaLabel("Choose a cover")], [
    h.a([h.Class("dock-arrow"), h.Href(`/moodboard/#${previous.id}`), h.AriaLabel("Previous cover")], ["↑"]),
    ...covers.map((entry) => h.keyed("a")(entry.id, [
      h.Href(`/moodboard/#${entry.id}`), h.Class("dock-cover"),
      h.AriaCurrent(entry.id === cover.id ? "true" : "false"),
      h.AriaLabel(`Study ${entry.title}`), h.Title(entry.title),
    ], [
      h.img([h.Src(`/moodboard/${entry.id}.jpg`), h.Alt(""), h.Decoding("async")]),
      h.span([h.Class("dock-tooltip")], [entry.title]),
    ])),
    h.a([h.Class("dock-arrow"), h.Href(`/moodboard/#${next.id}`), h.AriaLabel("Next cover")], ["↓"]),
  ]);
}

function paletteView(cover: Cover, h: HtmlBuilder<Message>) {
  return h.section([h.Class("room-palette"), h.AriaLabel("Cover colour palette")], [
    h.div([h.Class("palette-heading")], [
      h.h3([], ["Palette"]),
      h.a([
        h.Href(`data:text/css;charset=utf-8,${encodeURIComponent(paletteCss(cover))}`),
        h.Download(`${cover.id}-palette.css`),
      ], ["Save CSS ↓"]),
    ]),
    h.ul([], cover.palette.map((color) => h.keyed("li")(color.hex, [], [
      h.div([h.Class("palette-chip"), h.Style({ backgroundColor: color.hex }), h.AriaHidden(true)]),
      h.code([], [color.hex]),
    ]))),
    h.span([h.Class("palette-note")], ["Sampled sRGB"]),
  ]);
}
