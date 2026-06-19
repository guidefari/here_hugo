---
title: "Open/Closed Principle in React component libraries"
date: 2026-03-03T13:15:11+02:00
description: "Open-closed principle applied to shared/library React components - extend without breaking."
tags: [react, testing]
images:
  [
    "https://images-here-hugo.vercel.app/api/og-image?title=OCP+in+React+component+libraries",
  ]
---

> Software entities should be open for extension, but closed for modification

I have an interpretation of this principle in the context of React. When someone asks you to extend a component to support a new design or behaviour requirement,
you should be able to do that _without_ changing what existing consumers already rely on.

## The scenario

You're maintaining a shared `Button` component used across 40 screens in the app and there's a new `ghost` variant needed for a specific feature.

The _wrong_ move looks like this:

```tsx
// before
type ButtonProps = {
  label: string;
  onClick: () => void;
  primary?: boolean;
};

// after (bad) - you changed the shape of primary to accommodate ghost
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "ghost"; // removed `primary` boolean, changed the contract
};
```

Every consumer that was passing `primary={true}` just broke. Silently, if you're unlucky.

## The right move - opt-in extension

Keep the existing contract intact. Extend it additively.

```tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
  primary?: boolean; // untouched - existing consumers unaffected
  variant?: "ghost" | "outline"; // new capability, opt-in
};

export function Button({
  label,
  onClick,
  primary = false,
  variant,
}: ButtonProps) {
  const base = "px-4 py-2 rounded font-medium";

  if (variant === "ghost") {
    return (
      <button
        className={`${base} bg-transparent border border-current`}
        onClick={onClick}
      >
        {label}
      </button>
    );
  }

  if (variant === "outline") {
    return (
      <button
        className={`${base} bg-transparent border-2 border-blue-600 text-blue-600`}
        onClick={onClick}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      className={`${base} ${primary ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

The new `variant` prop is purely additive. All existing usages of the component continue to behave exactly as before.
The new design requirement is satisfied via opt-in.

```tsx
// Before (existing consumers):
//renders exactly the same as it always did
  <Button label="Save" primary onClick={save} />

// After (new consumer):
// gets the new ghost style
  <Button label="Cancel" variant="ghost" onClick={cancel} />
```

every new prop should have a default that matches the current behavior. If it doesn't default to something that preserves existing output, you've changed the contract.

## How snapshot tests protect you

Snapshot tests are underrated for component libraries specifically because they capture the _rendered output_ at a point in time.
If you accidentally violate Open/Closed Principle and changed something that alters the rendered output for existing usage, the snapshot fails.

```tsx
// Button.test.tsx
import { render } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("default renders correctly", () => {
    const { container } = render(<Button label="Save" onClick={() => {}} />);
    expect(container).toMatchSnapshot();
  });

  it("primary variant renders correctly", () => {
    const { container } = render(
      <Button label="Save" onClick={() => {}} primary />,
    );
    expect(container).toMatchSnapshot();
  });

  it("new ghost variant renders correctly", () => {
    const { container } = render(
      <Button label="Cancel" onClick={() => {}} variant="ghost" />,
    );
    expect(container).toMatchSnapshot();
  });
});
```

If you accidentally change the className applied to the default button, the first snapshot fails immediately (or whenever your tests run 👀), before this reaches any consumer.

The snapshots for `default` and `primary` are your regression guard. The snapshot for `ghost` documents the new behavior.

## Beyond snapshots. What else catches this?

- **Typescript**: if you removed or renamed a prop, TypeScript will catch it at build time for typed consumers. This is your first line of defense.

- **Visual regression tests**: tools like [Chromatic](https://www.chromatic.com/) capture screenshots of Storybook stories and diff them across PRs. This catches CSS changes that don't show up in DOM snapshots. Worth it once you have a component library worth protecting. (Shout out [Ryan](https://github.com/rollingryan) for putting me on)

- **Integration tests that use the component**: if you have tests for the actual features that use `Button`, those tests serve as an additional layer. A broken default button style might not kill a unit test but an integration test that asserts "the save button is visible and styled" will.

---

With all this said, I'm not advocating for never changing your contracts, it's a useful principle to help you examine trade-offs.

## Related reading

- [SOLID series: The Open-Closed Principle](https://blog.logrocket.com/solid-open-closed-principle/)
- [S.O.L.I.D Principles in React](https://github.com/Safnaj/React-SOLID-Principles?tab=readme-ov-file#open-closed-principle)
- [Effective Snapshot Testing](https://kentcdodds.com/blog/effective-snapshot-testing)
- [Reading list #19](/read/19) has some stuff on snapshot testing, and testing in general.
- Turns out I have [a note on SOLID](/solid) (I probably have not read this note since I wrote it in 2021)
