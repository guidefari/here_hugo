# Discord cross-post Worker

`DISCORD_WEBHOOK_URL` is the deploy-time Alchemy secret binding for the target Discord webhook. Configure feed URLs and per-source backfill policy in `src/sources.config.ts`.

Run locally without deploying:

```sh
bun run typecheck
bun test
bun run build
```
