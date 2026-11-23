import { Effect, Match, Option, Schema } from "effect";
import { Command, Dom, Navigation, Runtime, Struct, Update, Url } from "foldkit";
import { defineMessageUnion } from "foldkit/message";
import { Report } from "./report";
import { view } from "./view";

export { view };

export const Flags = Schema.Struct({ reports: Schema.Array(Report) });
export const Model = Schema.Struct({
  reports: Schema.Array(Report),
  path: Schema.String,
  query: Schema.String,
});
export type Model = typeof Model.Type;

export const Message = defineMessageUnion({
  ClickedLink: { request: Navigation.UrlRequest },
  ChangedUrl: { url: Url.Url },
  ChangedQuery: { value: Schema.String },
  CompletedNavigate: {},
  FailedNavigate: {},
  CompletedLoadExternal: {},
  FailedLoadExternal: {},
  CompletedFocusTarget: {},
  FailedFocusTarget: {},
});
export const {
  ClickedLink, ChangedUrl, ChangedQuery,
  CompletedNavigate, FailedNavigate,
  CompletedLoadExternal, FailedLoadExternal,
  CompletedFocusTarget, FailedFocusTarget,
} = Message;
export type Message = typeof Message.Type;

export const FocusTarget = Command.define("FocusTarget", {
  args: { id: Schema.String },
  messages: [CompletedFocusTarget, FailedFocusTarget],
  execute: ({ id }) => {
    const selector = `#${CSS.escape(id)}`;
    return Dom.scrollIntoViewAfterPaint(selector, { block: "start" }).pipe(
      Effect.andThen(Dom.focus(selector, { preventScroll: true, makeFocusable: true })),
      Effect.as(CompletedFocusTarget()),
      Effect.catch(() => Effect.succeed(FailedFocusTarget())),
    );
  },
});

export const Navigate = Command.define("Navigate", {
  args: { href: Schema.String },
  messages: [CompletedNavigate, FailedNavigate],
  execute: ({ href }) => Navigation.pushUrl(href).pipe(
    Effect.as(CompletedNavigate()),
    Effect.catch(() => Effect.succeed(FailedNavigate())),
  ),
});

const LoadExternal = Command.define("LoadExternal", {
  args: { href: Schema.String },
  messages: [CompletedLoadExternal, FailedLoadExternal],
  execute: ({ href }) => Navigation.load(href).pipe(
    Effect.as(CompletedLoadExternal()),
    Effect.catch(() => Effect.succeed(FailedLoadExternal())),
  ),
});

export const init: Runtime.RoutingApplicationInit<Model, Message, typeof Flags.Type> = (flags, url) => ({
  model: { reports: flags.reports, path: url.pathname, query: "" },
  commands: [FocusTarget({ id: Option.getOrElse(url.hash, () => "main-content") })],
});

export const update = (model: Model, message: Message): Update.Return<Model, Message> =>
  Match.value(message).pipe(
    Match.withReturnType<Update.Return<Model, Message>>(),
    Match.tagsExhaustive({
      ChangedQuery: ({ value }) => ({
        model: Struct.modifyFields(model, { query: () => value }),
      }),
      ChangedUrl: ({ url }) => ({
        model: Struct.modifyFields(model, { path: () => url.pathname, query: () => "" }),
        commands: [FocusTarget({ id: Option.getOrElse(url.hash, () => "main-content") })],
      }),
      ClickedLink: ({ request }) => Match.value(request).pipe(
        Match.withReturnType<Update.Return<Model, Message>>(),
        Match.tagsExhaustive({
          Internal: ({ url }) => ({
            model,
            commands: [url.pathname === "/rss.xml"
              ? LoadExternal({ href: Url.toString(url) })
              : Navigate({ href: Url.toString(url) })],
          }),
          External: ({ href }) => ({ model, commands: [LoadExternal({ href })] }),
        }),
      ),
      CompletedNavigate: () => ({ model }),
      FailedNavigate: () => ({ model }),
      CompletedLoadExternal: () => ({ model }),
      FailedLoadExternal: () => ({ model }),
      CompletedFocusTarget: () => ({ model }),
      FailedFocusTarget: () => ({ model }),
    }),
  );
