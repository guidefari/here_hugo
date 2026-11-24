export interface Cover {
  readonly id: string;
  readonly photo: number;
  readonly title: string;
  readonly author: string;
  readonly alt: string;
  readonly ink: string;
  readonly palette: ReadonlyArray<{ readonly name: string; readonly hex: string }>;
}

export const covers: readonly [Cover, ...Array<Cover>] = [
  {
    id: "cover-1", photo: 1,
    title: "The Art of Doing Science and Engineering",
    author: "Richard W. Hamming",
    alt: "Olive-green cover with small gold serif type and a thin, wandering gold technical line.",
    ink: "#F1E9D2",
    palette: [
      { name: "Olive field", hex: "#3C4435" },
      { name: "Soft gold", hex: "#BEA962" },
      { name: "Deep ochre", hex: "#5B4C18" },
    ],
  },
  {
    id: "cover-4", photo: 4,
    title: "Stubborn Attachments", author: "Tyler Cowen",
    alt: "Vivid red cover with a monochrome hand holding a tiny Earth and white sans-serif type.",
    ink: "#240709",
    palette: [
      { name: "Signal red", hex: "#EE293B" },
      { name: "Charcoal", hex: "#2F2D2E" },
      { name: "Photographic grey", hex: "#BEBFC2" },
      { name: "Paper white", hex: "#EFEFF1" },
    ],
  },
  {
    id: "cover-7", photo: 7,
    title: "Where Is My Flying Car?", author: "J. Storrs Hall",
    alt: "Bright cyan sky above a densely drawn grey traffic jam, with one tiny flying car overhead.",
    ink: "#002333",
    palette: [
      { name: "Cyan sky", hex: "#009CD9" },
      { name: "Road grey", hex: "#797979" },
      { name: "Ink", hex: "#030403" },
      { name: "Light graphite", hex: "#8C8C8C" },
    ],
  },
  {
    id: "cover-9", photo: 9,
    title: "The Big Score", author: "Michael S. Malone",
    alt: "Deep navy cover filled with coral circuit-board traces; the title and author sit inside chip shapes.",
    ink: "#F0D4CD",
    palette: [
      { name: "Blueprint navy", hex: "#012538" },
      { name: "Printed coral", hex: "#C15C5C" },
      { name: "Rust shadow", hex: "#914547" },
      { name: "Deep ink", hex: "#151B2C" },
    ],
  },
  {
    id: "cover-10", photo: 10,
    title: "The Origins of Efficiency", author: "Brian Potter",
    alt: "Slate-blue cover with a detailed silver and black cutaway of a machine and small pale text.",
    ink: "#E4E5E8",
    palette: [
      { name: "Slate blue", hex: "#1E2B3B" },
      { name: "Silver", hex: "#BFBFC0" },
      { name: "Steel grey", hex: "#787878" },
      { name: "Machine black", hex: "#151515" },
    ],
  },
];

export function selectedCover(anchor: string): Cover {
  return covers.find((cover) => cover.id === anchor) ?? covers[0];
}

export function paletteCss(cover: Cover): string {
  return `:root {\n${cover.palette.map((color, index) => `  --cover-${index + 1}: ${color.hex};`).join("\n")}\n}\n`;
}
