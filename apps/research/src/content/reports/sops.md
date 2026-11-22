---
title: "SOPS, age, and the secret's journey from Git to deployment"
description: "How SOPS encrypts configuration, how age or KMS controls decryption, and what happens when deployment tooling consumes the plaintext."
date: 2026-11-23
tags: [sops, age, secrets, deployments]
draft: false
---

SOPS lets you store encrypted configuration alongside code. A deployment tool can
then decrypt it where the secrets are needed, provided that tool has access to the
right key. SOPS supports YAML, JSON, ENV, INI, and binary files. It is a file
encryption and editing tool, not a hosted password manager or a deployment system.
([SOPS documentation](https://getsops.io/docs/))

The useful question is not just "is this file encrypted?" It is also "who can
decrypt it, and where does the plaintext go next?"

## SOPS and age do different jobs

There are two layers of encryption:

1. **SOPS encrypts the values.** It creates a random 256-bit data key for the file
   and uses AES-256-GCM to encrypt selected values.
2. **age or a key management service protects the data key.** An encrypted copy of
   that data key is stored in the document's SOPS metadata.

An authorized reader first recovers the data key, then uses it to decrypt the
values. The age integration encrypts the data key, not the whole YAML document.
([Encryption protocol](https://getsops.io/docs/reference/#encryption-protocol),
[age integration](https://getsops.io/docs/usage/identities/age/),
[implementation](https://github.com/getsops/sops/blob/main/age/keysource.go))

<figure class="sops-flow" aria-labelledby="sops-flow-caption">
<p class="sops-flow-title">Where the secret becomes plaintext</p>
<ol>
<li>
<span class="sops-flow-label">1 · Stored in Git</span>
<strong>Encrypted values + encrypted data key</strong>
<p>Public recipients and readable document structure may be present. The private identity is kept elsewhere.</p>
</li>
<li>
<span class="sops-flow-label">2 · Trusted decryption process</span>
<strong>Unlock the data key, then decrypt the values</strong>
<p>An age private identity or authorized KMS access arrives through a separate, secured path.</p>
</li>
<li>
<span class="sops-flow-label">3 · Deployment or runtime</span>
<strong>Plaintext credentials reach their consumer</strong>
<p>The runner, application, or Kubernetes Secret needs its own access controls. SOPS no longer protects this copy.</p>
</li>
</ol>
<figcaption id="sops-flow-caption">Git holds the encrypted document. A separately authorized process decrypts it. Protection after that boundary is the consumer's responsibility.</figcaption>
</figure>

An **age recipient** is public: it identifies who a file can be encrypted for.
An **age identity** is private: it enables decryption. Publishing a recipient
does not give someone the private identity. In ordinary multi-recipient
encryption, any matching identity can unlock the file; it is not a requirement
for every recipient to approve. SOPS also supports threshold key groups, which
are a separate configuration.
([age usage](https://github.com/FiloSottile/age#usage),
[SOPS key management](https://getsops.io/docs/usage/key-management/))

With KMS, the consumer instead uses an authorized cloud identity to access the
managed key. The file still has its SOPS data key. KMS changes how that key is
protected and accessed.
([SOPS AWS KMS integration](https://getsops.io/docs/usage/identities/amazon-aws-kms/))

## Why keep an encrypted file in Git?

It keeps configuration versioned alongside the deployment that consumes it,
without requiring Git to hold the plaintext values. SOPS normally leaves keys
and document structure readable while encrypting values. This helps deployment
tools understand the document and makes changes easier to locate, although
ciphertext does not tell a reviewer what the plaintext changed to.
([Common operations](https://getsops.io/docs/usage/common-operations/),
[encryption protocol](https://getsops.io/docs/reference/#encryption-protocol))

For Kubernetes manifests, a common rule encrypts values beneath `data` and
`stringData`, leaving resource names, namespaces, and kinds readable. That is
intentional partial visibility, not confidentiality for the entire document.
([Flux SOPS guide](https://fluxcd.io/flux/guides/mozilla-sops/))

`.sops.yaml` defines creation rules such as which filenames match and which
public recipients should receive access. Rules are evaluated in order, with the
first matching rule selected. Existing encrypted files carry their own recipient
metadata. Changing the config alone does not rewrite those files, and the config
is not an automatic Git encryption hook.
([Configuration rules](https://getsops.io/docs/usage/identities/config-file/),
[updating recipients](https://getsops.io/docs/usage/key-management/))

## Two ways deployment tools can consume it

### A local deployment runner

A runner can start SOPS as a subprocess, capture decrypted JSON through a pipe,
validate the result, then pass only the required credentials into a deployment
subprocess. SOPS also provides execution helpers for supplying decrypted
configuration to another process.
([Common operations](https://getsops.io/docs/usage/common-operations/))

This can avoid creating a decrypted output file. It does not make the plaintext
disappear: SOPS, the runner, and the receiving process must handle it, and those
processes must be trusted.

### Flux in a Kubernetes cluster

Flux can fetch encrypted manifests from Git, decrypt them during reconciliation,
and apply ordinary Kubernetes Secrets. Its Kustomization names a SOPS decryption
provider and a Secret containing the private age identity.
([Flux SOPS guide](https://fluxcd.io/flux/guides/mozilla-sops/))

The identity needs a separate bootstrap path. If Flux needs that identity to
decrypt the Git content, placing the only usable copy inside that same encrypted
content creates a circular dependency.

After application, Kubernetes holds decrypted Secrets. SOPS protected the Git
representation, not every subsequent copy or the cluster's own storage.
Kubernetes authorization and encryption at rest remain separate concerns.
([Flux SOPS guide](https://fluxcd.io/flux/guides/mozilla-sops/),
[Kubernetes Secrets security](https://kubernetes.io/docs/concepts/security/secrets-good-practices/))

The two paths differ in **who decrypts**, not in the basic encryption:

```text
Local deployment
  Bun runner
    SOPS + separately supplied age identity
      decrypted JSON through a pipe
        validated credentials
          deployment subprocess environment

Flux deployment
  Git reconciliation
    SOPS + separately bootstrapped cluster identity
      decrypted manifest
        Kubernetes Secret
          workload
```

## CI does not get access just by checking out Git

For age-backed files, a CI job needs a matching private identity delivered through
a separately secured mechanism. For KMS-backed files, it needs permission through
an appropriate cloud identity. SOPS supports identity-file and environment-based
lookup for age.
([age identities](https://getsops.io/docs/usage/identities/age/),
[KMS permissions](https://getsops.io/docs/usage/identities/amazon-aws-kms/))

A project can also use SOPS locally while supplying application credentials
directly from GitHub Secrets in CI. Those are separate mechanisms. The presence
of a SOPS file does not prove that the CI workflow decrypts it.
([GitHub Actions secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions))

## Editing, updating recipients, and rotating are not the same

These examples describe operations, not commands to run against production
without reviewing their impact.

| Operation | Example | What changes |
| --- | --- | --- |
| Edit content | `sops edit secrets/example.yaml` | The secret values you edit. Ordinary editing is not data-key rotation. |
| Update recipients | `sops updatekeys secrets/example.yaml` | Which recipients protect copies of the existing data key, based on config. |
| Rotate the data key | `sops rotate --in-place secrets/example.yaml` | The file's data key and the values encrypted with it. |
| Rotate an application credential | Replace a token or password at its provider, then update consumers | The actual credential accepted by the service. |

Updating recipients does not rotate the data key. Rotating the data key does not
change the password or API token inside the file.
([SOPS key management](https://getsops.io/docs/usage/key-management/),
[edit implementation](https://github.com/getsops/sops/blob/main/cmd/sops/edit.go))

If an identity is compromised, removing its recipient does not make old Git
revisions unreadable to someone who already has that identity. Nor does fresh
encryption invalidate an application token they already learned. Recovery needs
to address recipients, data keys, and actual credentials, not just one of them.
([Compromised-key recovery](https://getsops.io/docs/usage/key-management/))

## What SOPS does not protect

- **Plaintext after decryption.** Memory, environment variables, logs, and
  application or platform storage need their own protections.
- **Every editor artifact.** The current `sops edit` implementation uses an
  owner-only temporary plaintext file with cleanup. Editor backups and an unclean
  exit still need consideration.
- **Visible metadata.** Document structure and deliberately unencrypted fields
  can reveal information.
- **Lost identities.** Git can retain the ciphertext without retaining any way
  to decrypt it. Key backup and recovery are separate responsibilities.
- **Plaintext diff output.** SOPS supports decrypted Git diffs, but their output
  is still plaintext and can leak through review tooling or logs.

([Edit implementation](https://github.com/getsops/sops/blob/main/cmd/sops/edit.go),
[common operations](https://getsops.io/docs/usage/common-operations/),
[Flux guide](https://fluxcd.io/flux/guides/mozilla-sops/))

**In one sentence:** SOPS keeps encrypted secrets near code; age or KMS controls
who can unlock their data keys; deployment tooling decides where plaintext goes
next.

## Research scope

Researched on 23 November 2026 against official SOPS, age, Flux, Kubernetes, and
GitHub documentation. This is a conceptual guide, not a production deployment
procedure. Upstream source links track `main`; they do not establish the behavior
of every installed SOPS version. Repo-specific deployment findings are kept
outside this public repository.
