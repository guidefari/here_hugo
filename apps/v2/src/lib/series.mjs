import { getAllEntries } from "./content.mjs";

function seriesOf(entry) {
  const value = entry?.data?.series;
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function orderOf(entry) {
  const raw = entry?.data?.series_order;
  if (raw === undefined || raw === null || raw === "") return Number.MAX_SAFE_INTEGER;
  const n = Number(raw);
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
}

function isHub(entry) {
  return entry?.data?.series_index === true;
}

function sortByOrderAscDateAsc(a, b) {
  const byOrder = orderOf(a) - orderOf(b);
  if (byOrder !== 0) return byOrder;
  return (a.date?.valueOf() ?? 0) - (b.date?.valueOf() ?? 0);
}

const cache = new Map();

async function loadSeries(id) {
  if (cache.has(id)) return cache.get(id);
  const all = await getAllEntries();
  const members = all.filter((entry) => seriesOf(entry) === id);
  const hub = members.find(isHub);
  const children = members.filter((entry) => entry !== hub).sort(sortByOrderAscDateAsc);
  const ordered = hub ? [hub, ...children] : children;
  const result = {
    id,
    hub,
    members: ordered,
    children,
    currentIndex: (permalink) => ordered.findIndex((entry) => entry.permalink === permalink),
    entryAt: (index) => (index >= 0 && index < ordered.length ? ordered[index] : undefined),
  };
  cache.set(id, result);
  return result;
}

export async function getSeries(id) {
  return loadSeries(id);
}

export async function getSeriesForEntry(entry) {
  const id = seriesOf(entry);
  if (!id) return null;
  return loadSeries(id);
}

export function entrySeriesId(entry) {
  return seriesOf(entry);
}