import { Array, Option, Result, String } from "effect";
import { breadth, modules, passes, routes, strands } from "./curriculum";
import type { BreadthArea, Module, ProjectRoute, Strand, StudyPass } from "./curriculum";

export const foundationsHref = "/foundations/";
export const detailHeadingId = "foundations-detail-title";

export type Selection =
  | { readonly _tag: "Overview" }
  | { readonly _tag: "Module"; readonly module: Module }
  | { readonly _tag: "Route"; readonly route: ProjectRoute }
  | { readonly _tag: "Breadth"; readonly area: BreadthArea }
  | { readonly _tag: "Missing" };

export type Relation = "Selected" | "HelpsFirst" | "BuildsOn" | "Unrelated";

export type SearchMatch = {
  readonly id: string;
  readonly kind: "Module" | "Breadth" | "Route";
  readonly href: string;
  readonly label: string;
  readonly snippet: string;
};

export const moduleHref = (module: Module): string => `${foundationsHref}${module.id}/`;
export const routeHref = (route: ProjectRoute): string => `${foundationsHref}routes/${route.id}/`;
export const breadthHref = (area: BreadthArea): string => `${foundationsHref}breadth/${area.id}/`;
export const moduleLabel = (module: Module): string => `${moduleNumber(module)} ${module.title}`;
export const moduleNumber = (module: Module): string => module.number.toString().padStart(2, "0");

export function isFoundationsPath(path: string): boolean {
  return path === "/foundations" || path.startsWith("/foundations/");
}

export function selectionFromPath(path: string): Selection {
  const segments = path.split("/").filter(String.isNonEmpty).slice(1);
  if (Array.isArrayEmpty(segments)) {
    return { _tag: "Overview" };
  }
  const [first, second, ...rest] = segments;
  if (Array.isArrayNonEmpty(rest)) {
    return { _tag: "Missing" };
  }
  if (first === "routes" && second !== undefined) {
    return Option.match(Array.findFirst(routes, (route) => route.id === second), {
      onNone: () => ({ _tag: "Missing" }),
      onSome: (route) => ({ _tag: "Route", route }),
    });
  }
  if (first === "breadth" && second !== undefined) {
    return Option.match(Array.findFirst(breadth, (area) => area.id === second), {
      onNone: () => ({ _tag: "Missing" }),
      onSome: (area) => ({ _tag: "Breadth", area }),
    });
  }
  if (second !== undefined) {
    return { _tag: "Missing" };
  }
  return Option.match(findModule(first ?? ""), {
    onNone: () => ({ _tag: "Missing" }),
    onSome: (module) => ({ _tag: "Module", module }),
  });
}

export function findModule(id: string): Option.Option<Module> {
  return Array.findFirst(modules, (module) => module.id === id);
}

export function modulesIn(strand: Strand): ReadonlyArray<Module> {
  return Array.filter(modules, (module) => module.strand === strand.id);
}

export function strandOf(module: Module): Option.Option<Strand> {
  return Array.findFirst(strands, (strand) => strand.id === module.strand);
}

export function helpfulFirst(module: Module): ReadonlyArray<Module> {
  return Array.filterMap(module.helpfulFirst, (id) => findModule(id).pipe(Option.match({
    onNone: () => Result.failVoid,
    onSome: Result.succeed,
  })));
}

export function buildsOn(module: Module): ReadonlyArray<Module> {
  return Array.filter(modules, (other) => other.helpfulFirst.includes(module.id));
}

export function relationTo(selected: Module, other: Module): Relation {
  if (selected.id === other.id) {
    return "Selected";
  }
  if (selected.helpfulFirst.includes(other.id)) {
    return "HelpsFirst";
  }
  if (other.helpfulFirst.includes(selected.id)) {
    return "BuildsOn";
  }
  return "Unrelated";
}

export function stepNumbers(route: ProjectRoute, module: Module): ReadonlyArray<number> {
  return Array.filterMap(route.steps, (step, index) =>
    step.module === module.id ? Result.succeed(index + 1) : Result.failVoid);
}

export function routesThrough(module: Module): ReadonlyArray<ProjectRoute> {
  return Array.filter(routes, (route) => route.steps.some((step) => step.module === module.id));
}

export function passesWith(module: Module): ReadonlyArray<StudyPass> {
  return Array.filter(passes, (pass) => pass.modules.includes(module.id) || pass.alongside.includes(module.id));
}

export function neighbours(module: Module): { readonly previous: Option.Option<Module>; readonly next: Option.Option<Module> } {
  return {
    previous: Array.findFirst(modules, (other) => other.number === module.number - 1),
    next: Array.findFirst(modules, (other) => other.number === module.number + 1),
  };
}

export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function moduleMatches(module: Module, query: string): boolean {
  const needle = normalizeQuery(query);
  return String.isNonEmpty(needle) && Option.isSome(moduleSnippet(module, needle));
}

export function breadthMatches(area: BreadthArea, query: string): boolean {
  const needle = normalizeQuery(query);
  return String.isNonEmpty(needle) && Option.isSome(firstContaining([area.title, area.foothold, area.connection], needle));
}

export function searchMap(query: string): ReadonlyArray<SearchMatch> {
  const needle = normalizeQuery(query);
  if (String.isEmpty(needle)) {
    return [];
  }
  const moduleResults = Array.filterMap(modules, (module) => moduleSnippet(module, needle).pipe(Option.match({
    onNone: () => Result.failVoid,
    onSome: (snippet) => Result.succeed<SearchMatch>({
      id: module.id, kind: "Module", href: moduleHref(module), label: moduleLabel(module), snippet,
    }),
  })));
  const breadthResults = Array.filterMap(breadth, (area) =>
    firstContaining([area.title, area.foothold, area.connection], needle).pipe(Option.match({
      onNone: () => Result.failVoid,
      onSome: (snippet) => Result.succeed<SearchMatch>({
        id: area.id, kind: "Breadth", href: breadthHref(area), label: area.title, snippet,
      }),
    })));
  const routeResults = Array.filterMap(routes, (route) =>
    firstContaining([route.question, ...route.steps.map((step) => step.concept), route.evidence], needle).pipe(Option.match({
      onNone: () => Result.failVoid,
      onSome: (snippet) => Result.succeed<SearchMatch>({
        id: route.id, kind: "Route", href: routeHref(route), label: route.question, snippet,
      }),
    })));
  return [...moduleResults, ...breadthResults, ...routeResults];
}

function moduleSnippet(module: Module, needle: string): Option.Option<string> {
  return firstContaining([module.title, module.question, ...module.topics, module.experiment, module.preparation], needle);
}

function firstContaining(texts: ReadonlyArray<string>, needle: string): Option.Option<string> {
  return Array.findFirst(texts, (text) => text.toLowerCase().includes(needle));
}
