---
title: "Email on Goosebumps.fm with Amazon SES"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 50
description: How Goosebumps.fm provisioned SES through SST and sent mail from its Bun service.
tags: [infra, aws, sst, ses, email, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+email+on+SES"]
---

SST created an SES identity for the main domain and managed its DNS records through Cloudflare.

```ts
export const email = new sst.aws.Email('Email', {
  sender: domain,
  dns: sst.cloudflare.dns()
})
```

The Bun service loaded the sender domain through SST's global `Resource` module. AWS supplied credentials to the module-level SES client.

```ts
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { Resource } from 'sst'

export const sesClient = new SESv2Client({})

export function getFromAddress(from: string): string {
  return `${from}@${Resource.Email.sender}`
}
```

The email package built raw MIME messages and sent them through SES.

```ts
await sesClient.send(
  new SendEmailCommand({
    Destination: { ToAddresses: toAddresses },
    FromEmailAddress: `goosebumps.fm <${fromAddress}>`,
    Content: {
      Raw: { Data: Buffer.from(rawMessage) }
    }
  })
)
```

The helper returned `Promise<void>`, so callers discarded the SES response. The delivery table had a `sesMessageId` column, yet most sends could not fill it. The app treated a resolved request as `SENT` and a synchronous error as `FAILED`. It had no SES event handler for delivery, bounces, or complaints.

That code tied rendering to SES, SST resource lookup, hand-built MIME, and ambient AWS credentials. Several product flows imported the provider-backed helpers themselves. One password-reset callback started a send without awaiting it.

The migration kept the behavior users already had and added a provider receipt. Each caller now awaits its send. [Email on Cloudflare](/gbfm-cloudflare-email) shows how the runtime entry point owns provider access.
