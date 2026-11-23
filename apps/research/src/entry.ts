import { Effect, Schema } from "effect";
import { Runtime } from "foldkit";
import reports from "../.generated/reports.json";
import { ChangedUrl, ClickedLink, Flags, Model, init, update, view } from "./app";
import "./styles/global.css";

const application = Runtime.makeApplication({
  Flags,
  Model,
  init,
  update,
  view,
  container: document.getElementById("root"),
  routing: {
    onUrlRequest: (request) => ClickedLink({ request }),
    onUrlChange: (url) => ChangedUrl({ url }),
  },
});

Runtime.run(application, {
  flags: Effect.sync(() => Schema.decodeUnknownSync(Flags)({ reports })),
});
