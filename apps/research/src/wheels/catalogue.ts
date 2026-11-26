import { Array, Option, Record, Schema } from "effect";
import { Struct } from "foldkit";
import reference from "./reference.json";
import mediaByCell from "./media.json";
import { wheelAsset } from "./assets";

export const MediaKind = Schema.Literals(["Closeup", "OnCar"]);
export type MediaKind = typeof MediaKind.Type;

const Media = Schema.Struct({
  src: Schema.String,
  width: Schema.Number,
  height: Schema.Number,
  originalWidth: Schema.Number,
  originalHeight: Schema.Number,
  processing: Schema.String,
  kind: MediaKind,
  subject: Schema.String,
  match: Schema.Literals(["Visual match", "Candidate", "Catalogue attribution"]),
  sourcePage: Schema.String,
  original: Schema.String,
  credit: Schema.String,
  licence: Schema.String,
});
export type Media = typeof Media.Type;

const ChartCell = Schema.Struct({
  id: Schema.String,
  number: Schema.String,
  label: Schema.String,
  name: Schema.String,
  family: Schema.String,
  tile: Schema.String,
  alt: Schema.String,
  models: Schema.String,
  source: Schema.String,
  reference: Schema.String,
  description: Schema.String,
});

export const Identification = Schema.Literals(["Printed", "Candidate", "Unresolved", "Reference"]);
export type Identification = typeof Identification.Type;

export interface Wheel {
  readonly id: string;
  readonly number: string;
  readonly label: string;
  readonly name: string;
  readonly family: string;
  readonly tile: string;
  readonly alt: string;
  readonly models: string;
  readonly source: string;
  readonly reference: string;
  readonly description: string;
  readonly identification: Identification;
  readonly note: Option.Option<{ readonly text: string; readonly source: string }>;
  readonly media: ReadonlyArray<Media>;
}

const chart = Schema.decodeUnknownSync(Schema.Array(ChartCell))(reference);
const media = Record.map(
  Schema.decodeUnknownSync(Schema.Record(Schema.String, Schema.Array(Media)))(mediaByCell),
  (photos) => photos.map((photo) => Struct.modifyFields(photo, { src: () => wheelAsset(photo.src) })),
);

export const chartSheet = {
  src: wheelAsset("/wheels/original-chart.jpg"),
  width: 788,
  height: 995,
  post: "https://x.com/detta1z/status/2124824699779621292",
  original: "https://pbs.twimg.com/media/HXzkxwlXoAAyG6I.jpg?name=orig",
};

export const featuredPost = "https://x.com/brenzgarage/status/2124985492362182785";
export const featuredQuote = "Arguably a top 3 wheel of all time";

const identificationNotes: { readonly [id: string]: { readonly text: string; readonly source: string } } = {
  r2c7: {
    text: "No style number is printed. “Page 22” on the sheet is a brochure page, not Style 22. The exact style is unresolved, so no photograph is shown.",
    source: "https://pbs.twimg.com/media/HXzkxwlXoAAyG6I.jpg?name=orig",
  },
  r2c8: {
    text: "Candidate: Style 10. The parts catalogue names “Star-spoke styling II (styl.10)”, and the Roman II is not Style 11. Photographs show Style 10 family wheels; the exact chart variant is unverified.",
    source: "http://bmwfans.info/parts-catalog/E39-Touring/Europe/530i-M54/L-M/browse/wheels/star_spoke_styling_ii_styl_10_",
  },
  r3c3: {
    text: "Candidate: Style 38. Parts-catalogue terminology reads “3-spoke styling (styl.38)”, and the product photograph matches the three-spoke chart crop. “3” counts spokes; it is not a printed style number.",
    source: "http://bmwfans.info/parts-catalog/E39-Sedan/Europe/540i-M62/L-M/mar1996/browse/wheels/3_spoke_styling_styl_38",
  },
  r3c4: {
    text: "Candidate: Style 19. Parts-catalogue terminology reads “7-spoke composite wheel (styl.19)”. The riveted seven-spoke product photograph matches the chart crop. “7” counts spokes; it is not a printed style number.",
    source: "https://www.bmwpartsdeal.com/parts-list/1997-bmw-328is-coupe_e36/wheels/7_spoke_composite_wheel.html",
  },
  r3c7: {
    text: "Candidate: Style 29. The mesh is consistent with the 71 × 88 chart crop, but “Cross spoke” alone does not establish the number. The brochure’s page 33 or a part number is still needed.",
    source: "https://www.bmwcarwheels.com/bmw/style-29",
  },
  r3c8: {
    text: "No style number is printed. Style 71 is not a safe default, and the cell must not be merged with the separately printed Style 77. Unresolved, so no photograph is shown.",
    source: "https://www.bmwcarwheels.com/bmw/style-71",
  },
  r4c8: {
    text: "The unusual “M parallel spoke II” caption is preserved from the sheet. A contemporary enthusiast catalogue calls Style 65 “M Double Spoke”.",
    source: "https://www.bmwcarwheels.com/bmw/style-65",
  },
  r5c3: {
    text: "The chart specifies the composite construction of Style 5. The photographs show deep-lipped cross-spoke wheels consistent with it; split-rim construction, OEM status and exact variant are not verified.",
    source: "https://www.bmwcarwheels.com/bmw/style-5",
  },
  r1c1: {
    text: "Style 78 appears twice on the sheet: composite here, one-piece at row 5, column 4. Both positions share the same family photographs; construction is not separated in them.",
    source: "https://www.bmwcarwheels.com/bmw/style-78",
  },
  r5c4: {
    text: "Style 78 appears twice on the sheet: composite at row 1, column 1, one-piece here. Both positions share the same family photographs.",
    source: "https://www.bmwcarwheels.com/bmw/style-78",
  },
  r1c4: {
    text: "Style 42 appears twice: one-piece here, composite “II” at row 7, column 3. The Z3 photograph shows no visible rim rivets, consistent with this position.",
    source: "https://www.bmwcarwheels.com/bmw/style-42",
  },
  r7c3: {
    text: "Style 42 appears twice: composite “II” here, one-piece at row 1, column 4. The red Z3 photograph shows a riveted two-piece rim, consistent with this position; OEM status unverified.",
    source: "https://www.bmwcarwheels.com/bmw/style-42",
  },
};

const unresolved = new Set(["r2c7", "r3c8"]);

function identificationFor(cell: typeof ChartCell.Type): Identification {
  if (cell.number) {
    return "Printed";
  }
  return unresolved.has(cell.id) ? "Unresolved" : "Candidate";
}

export const featuredWheel: Wheel = {
  id: "csl",
  number: "163M / 127",
  label: "CSL reference",
  name: "CSL-style cross spoke",
  family: "Cross spoke",
  tile: wheelAsset("/wheels/csl-detail.webp"),
  alt: "Silver CSL-style wheel on the white BMW E46 in the BrenzGarage reference photograph",
  models: "E46 M3 CSL / CS / ZCP design family",
  source: "https://www.bmwcarwheels.com/bmw/style-127",
  reference: "Additional reference, not on the 63-wheel chart",
  description: "The design is catalogued as Style 127, later named 163M. CS/ZCP and CSL fronts differ, and a rear-quarter photograph cannot establish the exact set or prove OEM authenticity.",
  identification: "Reference",
  note: Option.some({
    text: "Style 163M / 127 naming overlaps. Rear-side casting marks, part numbers and dimensions would be needed to separate CSL, CS/ZCP and replica wheels.",
    source: "https://www.bimmerworld.com/Wheels-Tires/Wheels/BMW-E46-M3-CSL-Style-163M-19x85-ET44-Front-Wheel.html",
  }),
  media: [
    {
      src: wheelAsset("/wheels/photos/brenzgarage-e46-2400.webp"), width: 2400, height: 1800,
      originalWidth: 4032, originalHeight: 3024, processing: "Downscaled for the web, non-generative",
      kind: "OnCar", subject: "White BMW E46 with a CSL-style wheel and yellow brake caliper",
      match: "Visual match", sourcePage: featuredPost,
      original: "https://pbs.twimg.com/media/HX13ClsbQAAu6Vr.jpg?name=orig",
      credit: "@brenzgarage on X", licence: "No reuse licence stated",
    },
    {
      src: wheelAsset("/wheels/csl-detail.webp"), width: 800, height: 800,
      originalWidth: 4032, originalHeight: 3024, processing: "Crop of the same photograph, non-generative",
      kind: "Closeup", subject: "CSL-style wheel detail from the BrenzGarage photograph",
      match: "Visual match", sourcePage: featuredPost,
      original: "https://pbs.twimg.com/media/HX13ClsbQAAu6Vr.jpg?name=orig",
      credit: "@brenzgarage on X", licence: "No reuse licence stated",
    },
  ],
};

export const catalogue: ReadonlyArray<Wheel> = [
  ...chart.map((cell): Wheel => ({
    ...cell,
    tile: wheelAsset(cell.tile),
    description: cell.description.replace(/ The catalogue photograph shows a Style \d+ example; construction and finish may differ from this chart variant\./, " Photographs show the style family; construction and finish may differ from this chart variant."),
    identification: identificationFor(cell),
    note: Record.get(identificationNotes, cell.id),
    media: Option.getOrElse(Record.get(media, cell.id), () => []),
  })),
  featuredWheel,
];

export const chartColumns = 8;

export function wheelHref(wheel: Wheel): string {
  return `/wheels/${wheel.id}/`;
}

export function findWheel(path: string): Option.Option<Wheel> {
  return Array.findFirst(catalogue, (wheel) => wheelHref(wheel) === `${path.replace(/\/$/, "")}/`);
}

export function mediaOf(wheel: Wheel, kind: MediaKind): ReadonlyArray<Media> {
  return Array.filter(wheel.media, (entry) => entry.kind === kind);
}

export function tileId(wheel: Wheel): string {
  return `tile-${wheel.id}`;
}
