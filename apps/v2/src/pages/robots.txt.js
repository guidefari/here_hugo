export function GET() {
  return new Response("User-agent: *\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
