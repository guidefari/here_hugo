export function compileChapters(html: string, headings: ReadonlyArray<{ depth: number; slug: string; text: string }>) {
  const boundaries = [...html.matchAll(/<h2\b[^>]*\bid="([^"]+)"[^>]*>/g)];
  const starts = [
    { slug: "reading-overview", title: "Overview", offset: 0 },
    ...boundaries.map((match) => ({
      slug: match[1] ?? "",
      title: headings.find((heading) => heading.slug === match[1])?.text ?? "Section",
      offset: match.index,
    })),
  ];
  return starts.map((start, index) => {
    const end = starts[index + 1]?.offset ?? html.length;
    const content = html.slice(start.offset, end);
    return {
      slug: start.slug,
      title: start.title,
      start: start.offset,
      end,
      anchors: [...content.matchAll(/\bid="([^"]+)"/g)].flatMap((match) => match[1] ? [match[1]] : []),
    };
  }).filter((chapter) => html.slice(chapter.start, chapter.end).trim() !== "");
}
