import { getAliasTargets } from "../lib/content.mjs";

export async function GET() {
  const body = (await getAliasTargets()).map(({ alias, target }) => `${alias} ${target} 301`).join("\n");
  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
