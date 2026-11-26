import { describe, expect, test } from "vitest";
import { breadth, modules, openDecisions, passes, routes, strands, topicRecord } from "./curriculum";
import { buildsOn, findModule, modulesIn, selectionFromPath } from "./map";

const moduleIds = new Set(modules.map((module) => module.id));

describe("foundations curriculum data", () => {
  test("four strands hold four uniquely numbered modules each", () => {
    expect(strands).toHaveLength(4);
    strands.forEach((strand) => expect(modulesIn(strand)).toHaveLength(4));
    expect(modules.map((module) => module.number)).toEqual(Array.from({ length: 16 }, (_, index) => index + 1));
    expect(moduleIds.size).toBe(16);
    expect(breadth).toHaveLength(6);
    expect(routes).toHaveLength(7);
  });

  test("every relationship, route step, and pass points at a real module", () => {
    modules.forEach((module) => module.helpfulFirst.forEach((id) => {
      expect(moduleIds.has(id)).toBe(true);
      expect(id).not.toBe(module.id);
    }));
    routes.forEach((route) => route.steps.forEach((step) => expect(moduleIds.has(step.module)).toBe(true)));
    passes.forEach((pass) => [...pass.modules, ...pass.alongside].forEach((id) => expect(moduleIds.has(id)).toBe(true)));
  });

  test("the derived reverse relationship matches the declared preparation", () => {
    const networking = findModule("networking");
    expect(networking._tag).toBe("Some");
    if (networking._tag === "Some") {
      expect(buildsOn(networking.value).map((module) => module.id)).toEqual(["distributed-systems", "security", "reliability"]);
    }
  });

  test("published copy contains no em dashes", () => {
    const text = JSON.stringify({ strands, modules, breadth, routes, passes, topicRecord, openDecisions });
    expect(text).not.toContain("\u2014");
  });

  test("paths without a trailing slash resolve the same selection", () => {
    expect(selectionFromPath("/foundations")._tag).toBe("Overview");
    expect(selectionFromPath("/foundations/security")._tag).toBe("Module");
    expect(selectionFromPath("/foundations/breadth/graphics")._tag).toBe("Breadth");
    expect(selectionFromPath("/foundations/routes")._tag).toBe("Missing");
  });
});
