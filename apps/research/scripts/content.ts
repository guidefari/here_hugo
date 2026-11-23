import { createMarkdownProcessor, parseFrontmatter } from "@astrojs/markdown-remark";
import { Schema } from "effect";

const Frontmatter = Schema.Struct({
  title: Schema.String.check(Schema.isMinLength(1)),
  description: Schema.String.check(Schema.isMinLength(1)),
  date: Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/)),
  updated: Schema.optional(Schema.String),
  tags: Schema.optional(Schema.Array(Schema.String)),
  parent: Schema.optional(Schema.String),
  draft: Schema.optional(Schema.Boolean),
});

export async function compileReports(files: ReadonlyArray<{ id: string; text: string }>) {
  const markdown = await createMarkdownProcessor({
    shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
  });
  const reports = await Promise.all(files.map(async (file) => {
    const parsed = parseFrontmatter(file.text);
    const data = Schema.decodeUnknownSync(Frontmatter)({
      ...parsed.frontmatter,
      date: parsed.frontmatter.date instanceof Date
        ? parsed.frontmatter.date.toISOString().slice(0, 10)
        : parsed.frontmatter.date,
    });
    if (data.draft !== false) return [];
    const rendered = await markdown.render(parsed.content);
    return [{
      ...data,
      id: file.id,
      tags: data.tags ?? [],
      html: rendered.code,
      headings: rendered.metadata.headings,
    }];
  }));
  const published = reports.flat().sort((a, b) => b.date.localeCompare(a.date));
  const ids = new Set(published.map((report) => report.id));
  published.forEach((report) => {
    if (report.parent && !ids.has(report.parent)) throw new Error(`Missing published parent: ${report.id}`);
  });
  return published;
}
