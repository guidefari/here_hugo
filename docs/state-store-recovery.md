# State store protection and recovery

## Deployment boundary

`alchemy.run.ts` uses `infra/state-store.ts`, not `Cloudflare.state()`.
It connects only to the existing shared state store. It rejects an unavailable
store, a different endpoint/version, missing production state, and unreadable
records. It never bootstraps, resumes a local bootstrap, upgrades the state Worker,
or reconciles the account's encryption/authentication secrets. `--yes` does not
change that policy. Normal application state writes still happen during an approved
deployment.

The pinned Alchemy patch only exposes its existing login helper, credentials
schema, and state Worker version through the package export map. It does not
change providers or upgrade Alchemy. Keep the patch and lockfile together.

This protects deployments through this stack. Direct `alchemy provider cloudflare
bootstrap` commands and other repositories using older clients can still modify
the account-shared store. Do not run bootstrap, force a redeploy, rotate keys, or
clear state to fix a read failure.

## Before deployments or state-store maintenance

Run `bun run state:test`. Keep a private snapshot while state is still readable:

```bash
bun run state:backup "$HOME/.alchemy/credentials/<profile>/cloudflare-state-store.json"
```

Use an existing, valid credentials file for this account. Do not paste its token
into the terminal or a chat. The backup command performs state GETs only; it does
not refresh credentials or modify infrastructure. If credentials fail, stop and
resolve authentication separately. Do not bootstrap as a fallback.

The command saves workload state and the readable bootstrap records, including
the retained encryption-key value, under `~/.alchemy/recovery/<timestamp>-here-hugo-snapshot/`.
Directories use 0700 and files use 0600. The command verifies the saved bytes by
reading them back and comparing SHA-256 hashes. The bootstrap key's shape is
validated; this does not independently prove that it matches the current runtime
Secrets Store value. The Secrets Store metadata API cannot return secret values.

Keep a second protected copy outside this Mac, such as an approved encrypted
backup or password vault. Never commit snapshots, upload them as public CI
artifacts, or print their contents. No off-machine backup is configured here.

## Why this failure can recur

Alchemy beta.79 can turn an unsuccessful account subdomain/version lookup into
"store missing". With `--yes`, it can start a local bootstrap with fresh random
values. The adopted Secrets Store secret provider then patches an existing
same-name encryption secret with the new value. Old ciphertext remains in place.
Replacing a key is not a migration: it makes records written with an old key
unreadable until that key is recovered or the records are reconstructed.

Because this key is account-wide, one client's bootstrap can affect several
projects. Projects may fail days apart when each next accesses its old state.

For the November 2 repair, the retained October 24 key matched the current readable
bootstrap key record. It decoded all six archived bootstrap records but none of
the older gbfm, Hetzner, or here-hugo exports. The shared secret's modified time
was October 13. The October 24 and 25 recovery publication scripts reconstructed
application state; they did not patch the shared key. These facts support an
older shared-key mismatch, but do not prove which request changed the value:
audit access was denied, a modification timestamp can include non-value changes,
and the runtime secret value was not independently retrieved. The earlier
recoveries and this repair used whichever key the shared Worker resolved at the
time; its metadata shows no later secret modification, not independent proof of
the exact runtime bytes on each date.

## If a future read fails

Stop deployment. Preserve existing snapshots and ciphertext. Check a nonexistent
resource, an existing resource, and an unaffected stack to separate authentication,
availability, and record decoding failures. Keep all values private. Compare
retained key candidates offline; a candidate mismatch alone does not prove a
rotation. Restore or reconstruct only the explicitly approved scope, preserving
physical resource identities, then verify readbacks and a non-destructive plan.
Reconstruction cannot recover unknown historical replacement generations or secret
values from metadata alone.

For account-wide prevention, review deployment credentials so ordinary application
deployments cannot modify shared Secrets Store values. Verify the exact Cloudflare
permission granularity before changing tokens. Token changes, shared Worker/key
policy changes, and rollout to other repositories require separate approval.
