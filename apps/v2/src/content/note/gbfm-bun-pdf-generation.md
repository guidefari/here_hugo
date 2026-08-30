---
title: "QR PDF generation in the Bun version of Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 110
description: How the Bun server read local font files while creating QR PDFs.
tags: [infra, aws, bun, pdf, effect, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+Bun+PDF+generation"]
---

The Bun server created QR PDFs in the API process. It read two JetBrains Mono files when the module loaded, then gave those bytes to `pdf-lib`.

```ts
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const jbMonoBold = readFileSync(
  join(import.meta.dir, '../assets/fonts/JetBrainsMono-Bold.ttf')
)
```

The generator registered `fontkit` and embedded the loaded font.

```ts
pdfDoc.registerFontkit(fontkit)

const fontBold = yield* Effect.tryPromise({
  try: () => pdfDoc.embedFont(jbMonoBold),
  catch: (error) =>
    new DatabaseError({
      message: `Failed to embed font: ${getErrorMessage(error)}`,
      operation: 'font',
      table: 'pdf'
    })
})
```

Bun supplied a module directory and a filesystem. ECS shipped the font files with the server image. Those facts formed part of the feature, even though the service contract only spoke about PDF generation.

The code produced PDF bytes and stored them in S3. It returned the public CDN address.

```ts
const pdfBytes = yield* generateQROnlyPdf(mix, qrDataUrl)

yield* s3Service
  .uploadFile(
    cacheKey,
    Buffer.from(pdfBytes),
    'application/pdf',
    bucketName
  )
```

## Take aways

- A module-scope file read makes local assets part of server startup.
- Runtime work includes the PDF library and font loading.
- In-memory PDF bytes provide a clean storage handoff.
- The CDN URL can stay independent from the process that creates the file.

The [Worker note](/gbfm-worker-pdf-boundary) shows the current boundary. The snippets above come from `apps/vps/src/services/qrcode.service.ts` at commit `58099e57d`.
