import { Option } from "effect";
import type { Document, HtmlBuilder } from "foldkit/html";
import type { Message, Model } from "../app";
import { findWheel } from "./catalogue";
import { chartView } from "./chart";
import { sourcesPanel } from "./sources";
import { overviewStage, sourcesPanelId, wheelStage } from "./stage";
import "./styles.css";

export function wheelAtlasView(model: Model, h: HtmlBuilder<Message>): Document {
  const path = model.path.replace(/\/$/, "");
  const selected = findWheel(model.path);
  const isOverview = path === "/wheels";
  return {
    title: `${Option.match(selected, { onNone: () => "The wheel atlas", onSome: (wheel) => `BMW ${wheel.name}` })} | Guide Fari Research`,
    body: h.div([h.Class(`wheel-atlas${isOverview ? " is-overview" : ""}`)], [
      h.a([h.Class("skip-link"), h.Href("#main-content")], ["Skip to the wheel"]),
      h.header([h.Class("atlas-bar")], [
        h.a([h.Href("/"), h.Class("atlas-brand")], ["GF ", h.span([], ["Research"])]),
        h.p([h.Class("atlas-name")], ["BMW wheel atlas"]),
        h.nav([h.AriaLabel("Atlas")], [
          h.a([h.Href("/wheels/"), h.AriaCurrent(isOverview ? "page" : "false")], ["Overview"]),
          h.button([h.Type("button"), h.Class("atlas-link-button"), h.Popovertarget(sourcesPanelId)], ["Sources and notes"]),
        ]),
      ]),
      chartView(selected, h),
      Option.match(selected, {
        onNone: () => isOverview ? overviewStage(h) : missingStage(h),
        onSome: (wheel) => wheelStage(wheel, model.wheelView, model.wheelPhoto, h),
      }),
      sourcesPanel(selected, h),
    ]),
  };
}

function missingStage(h: HtmlBuilder<Message>) {
  return h.main([h.Id("main-content"), h.Class("atlas-stage is-missing"), h.Tabindex(-1)], [
    h.h1([h.Id("atlas-title"), h.Tabindex(-1)], ["Style not found."]),
    h.a([h.Href("/wheels/"), h.Class("atlas-button")], ["← Back to the overview"]),
  ]);
}
