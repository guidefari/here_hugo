---
title: "Rehydrating HTML Select on Component Mount"
date: 2022-03-26T11:35:44+02:00
description: There's always some HTML & CSS to learn, always.
tags: [til, frontend]
---


# Scenario
If you've got some values in your state, and you'd like to indicate those on a `Select` when the component/page mounts, here's a code snippet of how I did it.

```tsx
<Select
    onChange={handleMonthChange}
    placeholder="mm"
    isRequired
    defaultValue={valueFromState || ""}
>
    {expiryMonths.map((month) => (
    <option key={month} value={month}>
        {month}
    </option>
    ))}
</Select>
```