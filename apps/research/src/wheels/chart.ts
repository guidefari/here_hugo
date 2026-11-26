import { Array, Option, Record } from "effect";
import type { HtmlBuilder, KeyboardModifiers } from "foldkit/html";
import { PressedWheelKey } from "../app";
import type { Message } from "../app";
import { catalogue, chartColumns, tileId, wheelHref } from "./catalogue";
import type { Wheel } from "./catalogue";

export function chartView(selected: Option.Option<Wheel>, h: HtmlBuilder<Message>) {
  const selectedIndex = Option.match(selected, {
    onNone: () => -1,
    onSome: (wheel) => catalogue.findIndex((entry) => entry.id === wheel.id),
  });
  const tabStop = Math.max(selectedIndex, 0);
  return h.nav([
    h.Class("atlas-chart"), h.AriaLabel("Wheel chart"),
    h.OnKeyDownPreventDefault((key, modifiers) => chartKey(key, modifiers, selectedIndex)),
  ], [
    h.ol([h.Class("chart-grid")], catalogue.map((wheel, index) => h.keyed("li")(wheel.id, [], [
      h.a([
        h.Id(tileId(wheel)), h.Href(wheelHref(wheel)),
        h.Class(`chart-tile is-${wheel.identification.toLowerCase()}`),
        h.AriaLabel(`${wheel.label}: ${wheel.name}`),
        h.AriaCurrent(index === selectedIndex ? "page" : "false"),
        h.Tabindex(index === tabStop ? 0 : -1),
        h.Title(`${wheel.label}: ${wheel.name}`),
      ], [
        h.img([h.Src(wheel.tile), h.Alt(""), h.Width("71"), h.Height("88"), h.Decoding("async")]),
        h.span([h.Class("chart-tile-number"), h.AriaHidden(true)], [tileNumber(wheel)]),
      ]),
    ]))),
    h.p([h.Class("chart-hint")], [
      h.span([h.Class("chart-legend")], ["? unnumbered on the sheet"]),
      h.span([h.Class("chart-legend")], ["CSL extra reference"]),
      h.span([], ["Arrow keys move through the chart"]),
    ]),
  ]);
}

function tileNumber(wheel: Wheel): string {
  if (wheel.identification === "Reference") {
    return "CSL";
  }
  return wheel.number || "?";
}

function chartKey(key: string, modifiers: KeyboardModifiers, index: number): Option.Option<Message> {
  if (modifiers.altKey || modifiers.ctrlKey || modifiers.metaKey || modifiers.shiftKey) {
    return Option.none();
  }
  const count = catalogue.length;
  const moves: { readonly [key: string]: number } = {
    ArrowRight: (index + 1) % count,
    ArrowLeft: index < 0 ? count - 1 : (index - 1 + count) % count,
    ArrowDown: index < 0 ? 0 : (index + chartColumns) % count,
    ArrowUp: index < 0 ? count - chartColumns : (index - chartColumns + count) % count,
    Home: 0,
    End: count - 1,
  };
  const target = Record.get(moves, key);
  return Option.flatMap(target, (position) => Option.map(
    Array.get(catalogue, position),
    (wheel) => PressedWheelKey({ href: wheelHref(wheel) }),
  ));
}
