---
title: "Email on Goosebumps.fm with Cloudflare"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 51
description: How Alchemy provisions Cloudflare Email Sending and the Worker records each provider receipt.
tags: [infra, cloudflare, alchemy, email, effect, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+email+on+Cloudflare"]
---

Alchemy enables Email Routing, creates the sending subdomain, and gives the production Worker an `EMAIL` binding. Production restricts that binding to the configured sender address.

```ts
const routing = yield* Cloudflare.Email.Routing('EmailRouting', { zone: 'goosebumps.fm' })
yield* Cloudflare.Email.SendingSubdomain('EmailSending', {
  zoneId: routing.zoneId,
  name: emailConfig.sendingDomain
})

if (config.isProduction) {
  return yield* Cloudflare.Email.SendEmail('EMAIL', {
    allowedSenderAddresses: [emailConfig.emailSender]
  })
}
```

The API resource passes the binding into the Worker environment.

```ts
env: {
  DB: store.db,
  USER_CONTENT: store.userContent,
  MIXES: store.mixes,
  SITEMAP: store.sitemap,
  REMINDERS: store.reminders,
  ...(email === undefined ? undefined : { EMAIL: email }),
  EMAIL_SENDER: emailConfig.emailSender,
  EMAIL_TRANSPORT_MODE: emailConfig.transport,
```

The source continues with the other Worker bindings.

The Worker composition code turns that request-local binding into an Effect `EmailTransport`. Template builders and product services never import Cloudflare types.

```ts
const sendWithCloudflare = (binding: CloudflareEmailBinding, message: OutboundEmailMessage) =>
  Effect.tryPromise({
    try: () => binding.send(toCloudflareMessage(message)),
    catch: classifyCloudflareError
  }).pipe(
    Effect.flatMap((result) =>
      result.messageId.trim().length === 0
        ? Effect.fail(new EmailUnavailable({ providerCode: 'invalid-receipt' }))
        : Effect.succeed({ provider: 'cloudflare' as const, messageId: result.messageId })
    )
  )
```

`EmailDelivery` creates a `PENDING` row before the send. Once Cloudflare accepts the message, the service stores its provider and message ID. It also records the application-clock time.

```ts
yield* persist('mark-sent', () =>
  markEmailDeliveryLogAsSent(
    pending.id,
    {
      provider: receipt.provider,
      providerMessageId: receipt.messageId,
      acceptedAt
    },
    database
  )
)
```

`SENT` records provider acceptance. Cloudflare's dashboard owns final delivery checks. The app keeps historical SES IDs under the same `provider` and `providerMessageId` fields.

The `send_email` binding only exists inside Workers. That fact joined the email cut to the Worker cut. Local Alchemy bindings can reach the remote service, so ordinary local runs use a recording transport. A human staging run sends each critical template to one controlled mailbox and checks its receipt, links, SPF, DKIM, and DMARC headers.

Cloudflare's structured API removed the raw MIME builder. The app sends one message to one recipient, which matches its product flows and keeps provider limits out of its service contract. Read [the SES version](/gbfm-ses-email) for the earlier setup.
