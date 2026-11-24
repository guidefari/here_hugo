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

<figure class="diagram" aria-labelledby="gitops-context-caption">
<p class="diagram-title">The GitOps loop, and what sits outside it</p>
<ol class="d-flow has-edges">
<li class="d-node"><em class="d-tag">Desired state</em><b>Git repository</b><span>Manifests and config, including credentials</span></li>
<li class="d-edge">pulled by</li>
<li class="d-node"><em class="d-tag">Agent</em><b>Flux controllers</b><span>Compare Git with the cluster, apply the difference</span></li>
<li class="d-edge">applies to</li>
<li class="d-node"><em class="d-tag">Actual state</em><b>Kubernetes cluster</b><span>Running workloads</span></li>
</ol>
<p class="d-loop">Reconciliation repeats on an interval, so the cluster keeps converging on what Git says.</p>
<div class="d-outside"><b>Bootstrap, once, outside the loop</b><span>Create the server and Kubernetes, install Flux, and hand the cluster anything it needs before it can read Git. A private decryption key is one of those things.</span></div>
<figcaption id="gitops-context-caption">Simplified, not an audit of a real cluster. The loop can only manage what the bootstrap has already made possible.</figcaption>
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

<figure class="diagram" aria-labelledby="key-layers-caption">
<p class="diagram-title">One file, two locks</p>

```yaml
stringData:
  API_TOKEN: ENC[AES256_GCM,data:...,iv:...,tag:...,type:str]
sops:
  age:
    - recipient: age1...
      enc: |
        -----BEGIN AGE ENCRYPTED FILE-----
        ...
        -----END AGE ENCRYPTED FILE-----
  mac: ENC[AES256_GCM,data:...,iv:...,tag:...,type:str]
  version: ...
```

<ol class="d-flow has-edges">
<li class="d-node is-sealed"><em class="d-tag">Outside Git</em><b>age identity</b><span>Private. Matches the public <code>recipient</code></span></li>
<li class="d-edge">unlocks</li>
<li class="d-node is-sealed"><em class="d-tag">sops.age[].enc</em><b>Data key</b><span>Stored in the file, encrypted once per recipient</span></li>
<li class="d-edge">decrypts</li>
<li class="d-node is-plain"><em class="d-tag">Result</em><b>Plaintext values</b><span>Each <code>ENC[...]</code> field, decrypted with AES-256-GCM</span></li>
</ol>
<figcaption id="key-layers-caption">Abbreviated file: ciphertext and some metadata fields are elided. The identity protects the data key, and the data key protects the values, so replacing one does not replace the other.</figcaption>
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

<figure class="diagram" aria-labelledby="deployment-lanes-caption">
<p class="diagram-title">Same encrypted file, two places plaintext appears</p>
<p class="d-legend" aria-hidden="true"><span class="is-sealed">Encrypted</span><span class="is-boundary">Decryption, needs the private identity</span><span class="is-plain">Plaintext, protected by something other than SOPS</span></p>
<div class="d-lanes">
<section class="d-lane" aria-label="Local deployment runner">
<p class="d-lane-name">Local runner</p>
<ol class="d-flow">
<li class="d-node is-sealed"><em class="d-tag">Encrypted</em><b>File in Git</b></li>
<li class="d-boundary">identity from the operator's machine</li>
<li class="d-node is-plain"><em class="d-tag">Plaintext</em><b>Runner process</b><span>Reads SOPS output from a pipe</span></li>
<li class="d-node is-plain"><em class="d-tag">Plaintext</em><b>Deploy subprocess</b><span>Gets only what it needs, in its environment</span></li>
</ol>
</section>
<section class="d-lane" aria-label="Flux reconciliation">
<p class="d-lane-name">Flux</p>
<ol class="d-flow">
<li class="d-node is-sealed"><em class="d-tag">Encrypted</em><b>Manifest in Git</b></li>
<li class="d-boundary">identity from a bootstrapped cluster Secret</li>
<li class="d-node is-plain"><em class="d-tag">Plaintext</em><b>Kubernetes Secret</b><span>Applied during reconciliation</span></li>
<li class="d-node is-plain"><em class="d-tag">Plaintext</em><b>Workload</b><span>Reads the Secret</span></li>
</ol>
</section>
</div>
<figcaption id="deployment-lanes-caption">The paths differ in who decrypts and where the identity comes from, not in the encryption. Everything right of the dashed line relies on process trust, Kubernetes authorization, and storage encryption.</figcaption>
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

<figure class="diagram d-matrix" aria-labelledby="rotation-caption">
<p class="diagram-title">Which operation changes what</p>

| Operation | Who can unlock | Data key | Values in the file | Credential the service accepts |
| --- | --- | --- | --- | --- |
| Edit content<br>`sops edit` | Same | Same | **Changes** | Same |
| Update recipients<br>`sops updatekeys` | **Changes** | Same | Same | Same |
| Rotate the data key<br>`sops rotate --in-place` | Same | **Changes** | Re-encrypted, same plaintext | Same |
| Rotate an application credential<br>Replace it at the provider, then edit the file | Same | Same | **Changes** | **Changes** |

<figcaption id="rotation-caption">Example commands describe operations; review their impact before running them against real secrets. Only the last row changes what an attacker who already read the old value can use.</figcaption>
</figure>

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
