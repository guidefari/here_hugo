import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import type { DiscordEmbedPayload } from "../domain/discord-embed-payload";
import { DiscordDeliveryFailed } from "../domain/errors";

export interface DiscordPublisherService {
  readonly publish: (payload: DiscordEmbedPayload) => Effect.Effect<string, DiscordDeliveryFailed>;
  readonly update: (
    messageId: string,
    payload: DiscordEmbedPayload,
  ) => Effect.Effect<string, DiscordDeliveryFailed>;
}

export class DiscordPublisher extends Context.Service<DiscordPublisher, DiscordPublisherService>()(
  "@here/discord-crosspost/DiscordPublisher",
) {}

const DiscordResponse = Schema.Struct({ id: Schema.String });

const send = (
  webhookUrl: Redacted.Redacted<string>,
  method: "POST" | "PATCH",
  path: string,
  payload: DiscordEmbedPayload,
) =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: (signal) => fetch(`${Redacted.value(webhookUrl)}${path}`, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal,
      }),
      catch: () => new DiscordDeliveryFailed({ status: null, reason: "Discord request failed" }),
    });
    if (!response.ok) {
      return yield* Effect.fail(new DiscordDeliveryFailed({
        status: response.status,
        reason: `Discord returned HTTP ${response.status}`,
      }));
    }
    const body: unknown = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: () => new DiscordDeliveryFailed({ status: response.status, reason: "Discord response was not JSON" }),
    });
    const decoded = Schema.decodeUnknownResult(DiscordResponse)(body);
    return yield* Result.isFailure(decoded)
      ? Effect.fail(new DiscordDeliveryFailed({ status: response.status, reason: "Discord response had no message ID" }))
      : Effect.succeed(decoded.success.id);
  });

export const layer = (webhookUrl: Redacted.Redacted<string>) =>
  Layer.succeed(DiscordPublisher, DiscordPublisher.of({
    publish: Effect.fn("DiscordPublisher.publish")((payload) =>
      send(webhookUrl, "POST", "?wait=true", payload)),
    update: Effect.fn("DiscordPublisher.update")((messageId, payload) =>
      send(webhookUrl, "PATCH", `/messages/${encodeURIComponent(messageId)}`, payload)),
  }));
