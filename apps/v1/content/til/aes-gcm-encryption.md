---
title: "TIL: AES-GCM Encryption"
date: 2026-06-11T23:51:29+02:00
description: AES-GCM encrypts data and authenticates it, so you can detect tampering before trusting decrypted bytes.
tags: [til, cryptography, security]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Aes+Gcm+Encryption']
---

AES-GCM is an encryption mode that gives you two things at once:

- **Confidentiality**: someone without the key cannot read the plaintext.
- **Authenticity/integrity**: if the ciphertext is changed, decryption fails instead of returning silently corrupted data.

In Go, it commonly looks like this:

```go
blockCipher, _ := aes.NewCipher(key)
gcm, _ := cipher.NewGCM(blockCipher)
nonce := make([]byte, gcm.NonceSize())
rand.Read(nonce)
ciphertext := gcm.Seal(nonce, nonce, plaintext, nil)
```

The important bits:

- The **key** must stay secret.
- The **nonce** does not need to be secret, but must not be reused with the same key.
- The authentication tag is built into the GCM output, so decryption can reject tampered data.

In [SST's provider code](https://github.com/sst/sst/blob/dev/pkg/project/provider/provider.go), this is used in the shared `putData` helper before writing encrypted secrets to the configured backend, like AWS S3 or Cloudflare R2. The Cloudflare provider does not do its own encryption; it receives already-encrypted bytes and writes them to R2.

The passphrase lookup is backend-specific. For Cloudflare, SST stores it separately in R2 under `passphrase/<app>/<stage>`, with a source comment noting it should move to a secrets manager once that is available.

## References

- [Go `crypto/cipher.NewGCM`](https://pkg.go.dev/crypto/cipher#NewGCM)
- [Go `crypto/aes.NewCipher`](https://pkg.go.dev/crypto/aes#NewCipher)
- [NIST SP 800-38D: GCM and GMAC](https://csrc.nist.gov/pubs/sp/800/38/d/final)
