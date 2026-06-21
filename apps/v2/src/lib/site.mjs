export const site = {
  title: "Guide Fari",
  subtitle: "software engineering, music, & everything between",
  url: "https://guidefari.com",
  language: "en-us",
  copyright: "© Guide Fari",
  analyticsId: "G-QNKPVT1XN3",
};

export const navItems = [
  { label: "home", href: "/" },
  { label: "now", href: "/now/" },
  { label: "unoffice hours", href: "/unoffice-hours/" },
  { label: "writing", href: "/writing/" },
  { label: "media", href: "/media/" },
  { label: "rss", href: "/index.xml" },
];

export const flattenedSections = new Set([
  "post",
  "album",
  "artist",
  "resource",
  "til",
  "track",
  "book",
  "playlist",
  "mix",
  "note",
  "bliki",
  "media",
]);

export const writingSections = ["note", "til", "bliki", "book", "resource", "read"];

export const homeWritingSections = ["note", "til", "bliki", "book"];

export const sectionLinks = {
  note: "/note/",
  til: "/til/",
  bliki: "/bliki/",
  book: "/book/",
};

export const sectionMeta = {
  note: {
    label: "Notes",
    description: "Technical notes, observations, and ideas-in-progress.",
  },
  til: {
    label: "TIL",
    description: "Small, atomic things I learned today.",
  },
  bliki: {
    label: "Bliki",
    description: "Blog/wiki hybrids: longer-form evolving posts.",
  },
  book: {
    label: "Book Notes",
    description: "Reviews, highlights, and takeaways from books.",
  },
  resource: {
    label: "Resources",
    description: "Curated links, tools, and reference collections.",
  },
  read: {
    label: "Reading List",
    description: "Newsletter-style roundups of what I read and why.",
  },
};
