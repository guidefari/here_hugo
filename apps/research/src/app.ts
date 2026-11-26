import { Effect, Match, Option, Schema } from "effect";
import { Command, Dom, Navigation, Runtime, Struct, Update, Url } from "foldkit";
import { defineMessageUnion } from "foldkit/message";
import { Report } from "./report";
import { view } from "./view";
import { selectedCover } from "./moodboard/covers";
import { findWheel, tileId } from "./wheels/catalogue";

export { view };

export const WheelView = Schema.Literals(["Auto", "Closeup", "OnCar"]);
export type WheelView = typeof WheelView.Type;

export const Flags = Schema.Struct({ reports: Schema.Array(Report) });
export const Model = Schema.Struct({
  reports: Schema.Array(Report),
  path: Schema.String,
  query: Schema.String,
  anchor: Schema.String,
  contents: Schema.Literals(["Collapsed", "Expanded"]),
  wheelView: WheelView,
  wheelPhoto: Schema.Number,
});
export type Model = typeof Model.Type;

export const Message = defineMessageUnion({
  ClickedLink: { request: Navigation.UrlRequest },
  ChangedUrl: { url: Url.Url },
  ChangedQuery: { value: Schema.String },
  ClickedContents: {},
  PressedCoverArrow: { href: Schema.String },
  PressedWheelKey: { href: Schema.String },
  ClickedWheelView: { view: WheelView },
  ClickedWheelPhoto: { index: Schema.Number },
  PressedWheelPhotoKey: { index: Schema.Number },
  CompletedFocusWheel: {},
  FailedFocusWheel: {},
  CompletedNavigate: {},
  FailedNavigate: {},
  CompletedLoadExternal: {},
  FailedLoadExternal: {},
  CompletedFocusTarget: {},
  FailedFocusTarget: {},
});
export const {
  ClickedLink, ChangedUrl, ChangedQuery, ClickedContents,
  PressedCoverArrow, PressedWheelKey, ClickedWheelView, ClickedWheelPhoto, PressedWheelPhotoKey,
  CompletedFocusWheel, FailedFocusWheel,
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

export const FocusWheel = Command.define("FocusWheel", {
  args: { id: Schema.String },
  messages: [CompletedFocusWheel, FailedFocusWheel],
  execute: ({ id }) => {
    const selector = `#${CSS.escape(id)}`;
    return Dom.scrollIntoViewIfNotVisible(selector, { block: "nearest" }).pipe(
      Effect.andThen(Dom.focus(selector, { preventScroll: true, makeFocusable: true })),
      Effect.as(CompletedFocusWheel()),
      Effect.catch(() => Effect.succeed(FailedFocusWheel())),
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
  model: {
    reports: flags.reports, path: url.pathname, query: "", anchor: Option.getOrElse(url.hash, () => ""),
    contents: "Collapsed", wheelView: "Auto", wheelPhoto: 0,
  },
  commands: [focusCommand(url)],
});

export const update = (model: Model, message: Message): Update.Return<Model, Message> =>
  Match.value(message).pipe(
    Match.withReturnType<Update.Return<Model, Message>>(),
    Match.tagsExhaustive({
      ChangedQuery: ({ value }) => ({
        model: Struct.modifyFields(model, { query: () => value }),
      }),
      ClickedContents: () => ({
        model: Struct.modifyFields(model, { contents: (state) => state === "Collapsed" ? "Expanded" : "Collapsed" }),
      }),
      PressedCoverArrow: ({ href }) => ({
        model,
        commands: [Navigate({ href })],
      }),
      PressedWheelKey: ({ href }) => ({
        model,
        commands: [Navigate({ href })],
      }),
      ClickedWheelView: ({ view }) => ({
        model: Struct.modifyFields(model, { wheelView: () => view, wheelPhoto: () => 0 }),
      }),
      ClickedWheelPhoto: ({ index }) => ({
        model: Struct.modifyFields(model, { wheelPhoto: () => index }),
      }),
      PressedWheelPhotoKey: ({ index }) => ({
        model: Struct.modifyFields(model, { wheelPhoto: () => index }),
      }),
      ChangedUrl: ({ url }) => ({
        model: Struct.modifyFields(model, {
          path: () => url.pathname, query: () => "",
          anchor: () => Option.getOrElse(url.hash, () => ""), contents: () => "Collapsed",
          wheelView: (view) => isWheelPath(model.path) && isWheelPath(url.pathname) ? view : "Auto",
          wheelPhoto: () => 0,
        }),
        commands: [focusCommand(url)],
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
      CompletedFocusWheel: () => ({ model }),
      FailedFocusWheel: () => ({ model }),
      FailedFocusTarget: () => ({ model }),
    }),
  );

function isWheelPath(path: string): boolean {
  return path === "/wheels" || path.startsWith("/wheels/");
}

function focusCommand(url: Url.Url) {
  if (isWheelPath(url.pathname)) {
    return FocusWheel({
      id: Option.match(findWheel(url.pathname), { onNone: () => "atlas-title", onSome: tileId }),
    });
  }
  return FocusTarget({ id: focusTargetId(url) });
}

function focusTargetId(url: Url.Url): string {
  const anchor = Option.getOrElse(url.hash, () => "");
  if (url.pathname.replace(/\/$/, "") === "/moodboard") {
    return selectedCover(anchor).id;
  }
  return anchor || "main-content";
}
