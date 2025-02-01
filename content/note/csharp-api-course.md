---
title: "Csharp Api Course"
date: 2024-12-06T17:29:49+02:00
description: 
tags: []
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Csharp+Api+Course']
draft: true
---

Middleware is defined in the Program.cs file. eg
```cs
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
```

## Nullability
- If you enable nullability, also add this to your `csproj`

```
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
```

My mental model of this right now is similar to `strict: true` in typescript projects.