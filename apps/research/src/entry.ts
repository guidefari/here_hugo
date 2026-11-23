import { Effect, Schema } from "effect";
import { Runtime } from "foldkit";
import { initializeTelemetry, reportCrash } from "@here/telemetry";
import reports from "../.generated/reports.json";
import { ChangedUrl, ClickedLink, Flags, Model, init, update, view } from "./app";
import "./styles/global.css";

initializeTelemetry("research");

const application = Runtime.makeApplication({
  Flags,
  Model,
  init,
  update,
  view,
  crash: { report: ({ error }) => reportCrash(error) },
  container: document.getElementById("root"),
  routing: {
    onUrlRequest: (request) => ClickedLink({ request }),
    onUrlChange: (url) => ChangedUrl({ url }),
  },
});

Runtime.run(application, {
  flags: Effect.sync(() => Schema.decodeUnknownSync(Flags)({ reports })),
});
