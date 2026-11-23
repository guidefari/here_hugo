import { describe, expect, test } from "vitest";
import { compileReports } from "./content";

function report(id: string, extra = "") {
  return {
    id,
    text: `---\ntitle: "Example"\ndescription: "Source-backed research"\ndate: 2026-11-23\n${extra}\n---\n\n## Evidence\n\n[Source](https://example.com)\n\n\`\`\`ts\nconst value = 1\n\`\`\`\n\n<figure><figcaption>Diagram</figcaption></figure>`,
  };
}

describe("research publication", () => {
  test("compiles citations, heading anchors, highlighted code, and embedded visuals", async () => {
    const reports = await compileReports([report("published", "draft: false")]);
    expect(reports).toHaveLength(1);
    expect(reports[0]?.date).toBe("2026-11-23");
    expect(reports[0]?.html).toContain('href="https://example.com"');
    expect(reports[0]?.html).toContain('id="evidence"');
    expect(reports[0]?.html).toContain("astro-code");
    expect(reports[0]?.html).toContain("<figure>");
    expect(reports[0]?.headings).toEqual([{ depth: 2, slug: "evidence", text: "Evidence" }]);
  });

  test("excludes explicit and implicit drafts before compiling their bodies", async () => {
    expect(await compileReports([report("explicit", "draft: true"), report("implicit")])).toEqual([]);
  });

  test("rejects source notes whose parent is not published", async () => {
    await expect(compileReports([report("orphan", "draft: false\nparent: missing")]))
      .rejects.toThrow("Missing published parent: orphan");
  });
});
