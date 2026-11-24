import { Report } from "./report";

export function readingPosition(report: Report, anchor: string) {
  const found = report.chapters.findIndex((chapter) => chapter.slug === anchor || chapter.anchors.includes(anchor));
  const index = Math.max(0, found);
  return {
    index,
    chapter: report.chapters[index],
    previous: report.chapters[index - 1],
    next: report.chapters[index + 1],
  };
}
