---
title: "TIL: SST stores state and encrypted secrets in a backend"
date: 2026-06-11T10:00:00+02:00
description: SST stores state, secrets, snapshots, and event logs in its configured backend. Secrets are AES-GCM encrypted before being written to S3 or Cloudflare R2.
tags: [til, sst, infra, aws]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=SST+S3+State']
---

## Backend storage

SST uses the configured home provider as the underlying storage for persistent deployment data. With the AWS home provider, this is **S3**:

- **State files** at `app/<app>/<stage>.json`
- **Secrets** at `secret/<app>/<stage>` (encrypted)
- **Snapshots** at `snapshot/<app>/<stage>/<updateID>`
- **Event logs** at `eventlog/<app>/<stage>/<updateID>`

## Secret encryption

Before writing secrets to the configured backend, SST encrypts them with [**AES-GCM**](/aes-gcm-encryption). This happens in the shared provider layer, not inside the S3 or Cloudflare implementations:

```go
// pkg/project/provider/provider.go:374
func putData(backend Home, key, app, stage string, encrypt bool, data interface{}) error {
    // ...
    passphrase, _ := GetOrCreatePassphrase(backend, app, stage)
    blockCipher, _ := aes.NewCipher(passphraseBytes)
    gcm, _ := cipher.NewGCM(blockCipher)
    nonce := make([]byte, gcm.NonceSize())
    rand.Read(nonce)
    jsonBytes = gcm.Seal(nonce, nonce, jsonBytes, nil)
    return backend.putData(key, app, stage, bytes.NewReader(jsonBytes))
}
```

Only calls that pass `encrypt: true` through this helper get AES-GCM encryption. In this flow, that is `PutSecrets`; state, snapshots, summaries, locks, and event logs are written by their backend helpers without this AES-GCM step.

The passphrase is itself stored by the configured backend under `passphrase/<app>/<stage>`. For AWS, that means S3. For Cloudflare, that means R2.

## S3 interaction

The `AwsHome` implementation in `pkg/project/provider/aws.go:555` uses `GetObject`/`PutObject` on the bootstrap bucket (`bootstrap.State`, which is `sst-state-{id}`):

```go
func (a *AwsHome) putData(key, app, stage string, data io.Reader) error {
    s3Client := s3.NewFromConfig(a.provider.config)
    _, err = s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
        Bucket: aws.String(bootstrap.State),
        Key:    aws.String(a.pathForData(key, app, stage)),
        Body:   data,
    })
}
```

On the TypeScript side, `sst.Secret` reads from the `SST_SECRET_<NAME>` environment variable (set by the CLI at deploy time), falling back to a placeholder:

```ts
// platform/src/components/secret.ts:122
this._value = output(
  process.env["SST_SECRET_" + this._name] ?? this._placeholder,
).apply((value) => {
  if (typeof value !== "string") throw new SecretMissingError(this._name);
  return value;
});
```

## Cloudflare R2 equivalent

When using `home: "cloudflare"`, SST stores the same data in **Cloudflare R2** instead of S3, in a bucket named `sst-state`:

```go
// pkg/project/provider/cloudflare.go:102
func (c *CloudflareHome) Bootstrap() error {
    buckets, err := c.provider.api.ListR2Buckets(ctx, c.provider.identifier, cloudflare.ListR2BucketsParams{
        Name: "sst-state",
    })
    // ...
    _, err = c.provider.api.CreateR2Bucket(ctx, c.provider.identifier, cloudflare.CreateR2BucketParameters{
        Name: "sst-state",
    })
}
```

Data is read/written via direct R2 API calls (`putData` at line 138, `getData` at line 156) using the same `kind/app/stage` path scheme. The `provider.go` encryption layer is reused identically regardless of backend, so Cloudflare receives already-encrypted bytes for secrets.

The Cloudflare provider stores the passphrase separately in R2 under `passphrase/<app>/<stage>`:

```go
func (c *CloudflareHome) setPassphrase(app, stage string, passphrase string) error {
    return c.putData("passphrase", app, stage, bytes.NewReader([]byte(passphrase)))
}
```

Note the comment on `setPassphrase` (line 230):
```go
// these should go into secrets manager once it's out of beta
```

## Key commits for study

| Commit | Description |
|--------|-------------|
| [`ec2847b92`](https://github.com/sst/sst/commit/ec2847b92) | Compress AWS state files on S3 upload |
| [`363121ff3`](https://github.com/sst/sst/commit/363121ff3) | Remove state and encryption key on `sst remove` |
| [`5407560fd`](https://github.com/sst/sst/commit/5407560fd) | Allow empty SST secrets |
| [`cbe079919`](https://github.com/sst/sst/commit/cbe079919) | Fix refresh when using custom provider config |
| [`8cc5c2919`](https://github.com/sst/sst/commit/8cc5c2919) | Add locks to Cloudflare state upload |
