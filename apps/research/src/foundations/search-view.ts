import { Array, String } from "effect";
import type { HtmlBuilder } from "foldkit/html";
import { ChangedFoundationsQuery, ClickedClearFoundationsQuery, foundationsQueryId } from "../app";
import type { Message } from "../app";
import { normalizeQuery, searchMap } from "./map";
import type { SearchMatch } from "./map";

const visibleResults = 6;
const kindLabels = { Module: "Module", Breadth: "Breadth", Route: "Project route" } satisfies Record<SearchMatch["kind"], string>;

export function searchView(query: string, h: HtmlBuilder<Message>) {
  const matches = searchMap(query);
  const searching = String.isNonEmpty(normalizeQuery(query));
  return h.search([h.Class("fm-search")], [
    h.label([h.For(foundationsQueryId)], ["Find a concept"]),
    h.input([
      h.Id(foundationsQueryId), h.Type("search"), h.Value(query), h.Autocomplete("off"),
      h.Spellcheck(false), h.AriaDescribedBy("fm-search-hint"),
      h.OnInput((value) => ChangedFoundationsQuery({ value })),
    ]),
    h.p([h.Id("fm-search-hint"), h.Class("fm-search-hint")], ["Searches module questions, topics, experiments, breadth areas, and project routes. Try TLS, invariant, or cache."]),
    h.p([h.Role("status"), h.Class("fm-search-status")], [searching ? statusText(matches, query) : ""]),
    searching ? resultsView(matches, h) : h.empty,
  ]);
}

function statusText(matches: ReadonlyArray<SearchMatch>, query: string): string {
  const count = matches.length;
  return `${count} ${count === 1 ? "match" : "matches"} for “${query.trim()}”`;
}

function resultsView(matches: ReadonlyArray<SearchMatch>, h: HtmlBuilder<Message>) {
  return Array.match(matches, {
    onEmpty: () => h.div([h.Class("fm-search-empty")], [
      h.p([], ["Nothing on the map mentions that. The map is a study design, not a full index of computer science."]),
      h.button([h.Type("button"), h.Class("fm-button"), h.OnClick(ClickedClearFoundationsQuery())], ["Clear search"]),
    ]),
    onNonEmpty: (found) => h.div([], [
      h.ul([h.Class("fm-results")], found.slice(0, visibleResults).map((match) => h.keyed("li")(`${match.kind}-${match.id}`, [], [
        h.a([h.Href(match.href)], [match.label]),
        h.span([h.Class("fm-result-kind")], [kindLabels[match.kind]]),
        h.p([], [match.snippet]),
      ]))),
      found.length > visibleResults
        ? h.p([h.Class("fm-search-more")], [`Showing ${visibleResults} of ${found.length}. Matching modules and breadth areas are marked on the map.`])
        : h.empty,
    ]),
  });
}
