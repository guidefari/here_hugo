import { getAliasTargets } from "../lib/content.mjs";

export function GET() {
  const body = getAliasTargets().map(({ alias, target }) => `${alias} ${target} 301`).join("\n");
  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
