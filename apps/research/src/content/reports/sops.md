---
title: "SOPS, age, and the secret's journey from Git to deployment"
description: "How SOPS encrypts configuration, how age or KMS controls decryption, and what happens when deployment tooling consumes the plaintext."
date: 2026-11-23
updated: "2026-11-24"
tags: [sops, age, secrets, deployments]
draft: false
---

<aside class="context-note" aria-labelledby="context-note-label">
<p class="context-note-label" id="context-note-label">Why this note exists</p>
<p>Guide ran into SOPS while building an observability cluster hosted on Hetzner
and working out how to manage it with GitOps. The search started with FluxCD,
which a workmate had mentioned about a year earlier. This is Guide's own
recollection, shared on 24 November 2026. The rest of the note is agent research.</p>
</aside>

That gives SOPS a concrete job: **how can a cluster follow configuration in Git
when some of that configuration contains credentials that must not sit there as
plaintext?**

Encrypting the file answers half of it. The other half is "who can decrypt it,
and where does the plaintext go next?"

## The GitOps problem, before the encryption

**GitOps** treats versioned, declarative configuration in Git as the **desired
state**. Instead of someone running deploy commands, an automated agent compares
that desired state with what is running and corrects the difference. That
repeated compare-and-correct step is **reconciliation**.

**Flux** is one such agent. Its controllers run inside the Kubernetes cluster,
pull from Git, and apply what they find. Someone still has to create the server,
Kubernetes, and Flux itself before any of that can happen. That one-time setup
is the **bootstrap**, and it sits outside the loop it starts.
([GitOps principles](https://opengitops.dev/),
[Flux bootstrap](https://fluxcd.io/flux/installation/bootstrap/))

The credentials problem follows directly. If Git is the desired state, database
passwords and API tokens are part of that state too. Committing them as plaintext
gives them to everyone who can read the repository and its history.

<figure class="sops-flow" aria-labelledby="gitops-context-caption">
<p class="sops-flow-title">From a Git change to a running cluster</p>
<ol>
<li><span class="sops-flow-label">1 · Declare</span><strong>Git holds the desired configuration</strong><p>Review and version changes to workloads and their configuration. Secret values can be SOPS-encrypted.</p></li>
<li><span class="sops-flow-label">2 · Reconcile</span><strong>Flux pulls and applies that state</strong><p>Its SOPS integration can decrypt the secret manifests using an identity supplied separately to the cluster.</p></li>
<li><span class="sops-flow-label">3 · Consume</span><strong>Kubernetes runs the workloads</strong><p>Applications consume ordinary Kubernetes Secrets. The Git encryption does not protect every runtime copy.</p></li>
</ol>
<figcaption id="gitops-context-caption">A simplified GitOps flow, not a live cluster audit. Bootstrap access and the private decryption identity must exist outside this loop.</figcaption>
</figure>

**SOPS** is the file-encryption tool in that flow, not the GitOps controller or a
hosted password manager. It supports YAML, JSON, ENV, INI, and binary files.
**age** is one way to control who can unlock the file's data key. Flux's SOPS
integration connects these pieces without requiring Git to store plaintext
credential values.
([SOPS documentation](https://getsops.io/docs/),
[Flux SOPS guide](https://fluxcd.io/flux/guides/mozilla-sops/))

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

<figure class="sops-flow" aria-labelledby="key-layers-caption">
<p class="sops-flow-title">Two locks, two responsibilities</p>
<ol>
<li><span class="sops-flow-label">Outer lock · age or KMS</span><strong>Private identity → data key</strong><p>Your identity unlocks the encrypted copy of the file's data key. A public recipient alone cannot do this.</p></li>
<li><span class="sops-flow-label">Inner lock · SOPS</span><strong>Data key → secret values</strong><p>The recovered data key decrypts the values using AES-256-GCM. It is not the application's password.</p></li>
</ol>
<figcaption id="key-layers-caption">The identity protects the key; the key protects the values. Changing one is not automatically changing the other.</figcaption>
</figure>

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

For example, the stored shape can still tell you **what** the resource is while
hiding its value. This is an abbreviated illustration, not a usable encrypted
manifest: the ciphertext and required SOPS metadata are omitted.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: example-service
stringData:
  API_TOKEN: ENC[AES256_GCM,data:...,iv:...,tag:...,type:str]
```

The resource name is visible. The token is not.

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

<figure class="sops-flow" aria-labelledby="deployment-lanes-caption">
<p class="sops-flow-title">Same encrypted starting point, different plaintext destinations</p>
<div class="deployment-lanes">
<section>
<h3>Local deployment</h3>
<ol>
<li><strong>Bun runner starts SOPS</strong><p>A private age identity arrives separately from Git.</p></li>
<li><strong>Plaintext JSON crosses a pipe</strong><p>The runner validates it and selects the credentials the deployment needs.</p></li>
<li><strong>Deployment subprocess</strong><p>Receives credentials in its environment. The runner and child process must both be trusted.</p></li>
</ol>
</section>
<section>
<h3>Flux reconciliation</h3>
<ol>
<li><strong>Flux fetches Git content</strong><p>A separately bootstrapped cluster identity enables decryption.</p></li>
<li><strong>Plaintext manifest is applied</strong><p>The result is an ordinary Kubernetes Secret, not SOPS-encrypted storage.</p></li>
<li><strong>Workload consumes the Secret</strong><p>Cluster authorization and storage encryption protect this next stage.</p></li>
</ol>
</section>
</div>
<figcaption id="deployment-lanes-caption">Follow the plaintext boundary: a pipe avoids an output file, but neither path avoids handling plaintext.</figcaption>
</figure>

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

<figure class="sops-flow" aria-labelledby="rotation-caption">
<p class="sops-flow-title">Three separate things you may need to replace</p>
<ol>
<li><span class="sops-flow-label">Access</span><strong>Recipient set</strong><p>Who can unlock the current file? Update the encrypted copies of its data key.</p></li>
<li><span class="sops-flow-label">Encryption</span><strong>File data key</strong><p>What encrypts the values? Rotate it to re-encrypt the file.</p></li>
<li><span class="sops-flow-label">Service</span><strong>Actual credential</strong><p>What does the provider accept? Revoke or replace that credential at the provider.</p></li>
</ol>
<figcaption id="rotation-caption">These are separate controls, not interchangeable fixes. Old Git revisions and already-learned credentials remain part of recovery.</figcaption>
</figure>

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
