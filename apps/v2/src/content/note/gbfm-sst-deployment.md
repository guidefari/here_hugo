---
title: "Deploying Goosebumps.fm with SST"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 70
description: How SST linked application resources, kept Pulumi state, and deployed the AWS production service.
tags: [infra, aws, sst, pulumi, deployment, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+deployment+with+SST"]
---

SST loaded every file under `infra/` and used AWS as the stack home. The production removal policy retained S3 buckets and DynamoDB tables.

```ts
return {
  name: 'gbfm',
  removal: input?.stage === 'prod' ? 'retain' : 'remove',
  home: 'aws',
  providers: {
    cloudflare: '6.15.0',
    aws: { region: 'us-east-1' }
  }
}
```

Resources passed configuration through SST links. The ECS service received its URLs, file router, content buckets, and secrets in one list.

```ts
link: [
  urls,
  fileRouter,
  contentBucket,
  mixesBucket,
  ...allSecrets
]
```

Application code then read values from `Resource`, as the SES sender did:

```ts
export function getFromAddress(from: string): string {
  return `${from}@${Resource.Email.sender}`
}
```

The production workflow assumed an AWS role through GitHub OIDC and ran SST against the `prod` stage.

```yaml
- name: Configure Production AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{secrets.AWS_ROLE_ARN}}
    aws-region: us-east-1

- name: Deploy
  run: bun run sst deploy --stage=prod
```

Its post-deploy script checked ECS stability, the exact Sentry release in the task definition, two HTTP requests, and parented `db.query` spans in Sentry. The gate allowed 20 minutes because ECS and Sentry each needed their own polling window.

SST and Pulumi also owned Cloudflare records. State could carry old references after another tool had taken over a live resource. During teardown, each missing Cloudflare record stopped `sst remove` with a 404, so the operator removed those entries from state one at a time.

The production teardown then deleted the `www.goosebumps.fm` and apex DNS records. The plan had called their state entries stale, while Pulumi still held ownership of the live records underneath them. The site went down until an Alchemy deploy recreated the custom domains.

Seven SST stages existed in SSM, including an older `production` stage from 2024. That stage still held a CloudFront distribution, certificate, Lambda, and S3 assets. Listing state for the known `prod` stage would have missed them.

The teardown plan needed a live-provider check before each state deletion. SSM supplied the full stage list. SST's retain policy covered a narrow set of resources. [The Alchemy deployment](/gbfm-alchemy-deployment) records the current owner and checks.
