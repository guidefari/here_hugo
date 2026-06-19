---
title: "TIL: How to use Hugo CLI in a Remix.run project"
date: 2022-07-12T07:51:06+02:00
description: Something I learnt today. Maybe more than one thing👾Whilst trying to make use of Hugo CLI in a remix.run project that's powered by markdown content
tldr: Learn how to make use of Hugo CLI in a remix.run project that's powered by markdown content
tags: [til, hugo, cli]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=TIL%3A%20How%20to%20use%20Hugo%20CLI%20in%20a%20Remix.run%20project']
---

## What Hugo CLI offers 
Hugo has a very helpful feature included in it's cli, it's the `hugo new` command, and when combined with [archetypes](https://gohugo.io/content-management/archetypes/), it can save you a lot of time if you're constantly making new markdown files, like I am for this site.

## How I've been using it
when I want to make a new `TIL` article, all I have to type in the cli is 

```bash
hugo new til/hugo-mount-config.md
```

and I get a markdown file, in the right directory (`content/til/hugo-mount-config.md`), with the following in it

```md
---
title: "TIL: Hugo Mount Config"
date: 2022-07-12T07:51:06+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, hugo, cli]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=TIL%3A%20Hugo%20Mount%20Config']
---
```

this is what I have in the archetype file (`archetypes/til.md`)

```md
---
title: "TIL: {{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: Something I learnt today. Maybe more than one thing👾
tags: [til]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=']
---
```

This is a workflow I've become very used to when working with markdown files. Remix treats `.md` & `.mdx` as first class citizens, so I'm using that to power my content in a remix app

# Hugo Mount Config
This is where Hugo mount config comes in. In the Remix app, I created an archetype directory, but I want the output from the cli to be `app/routes`, so this is what my `config.yaml`(used by the Hugo CLI) file looks like

```yaml
module:
  mounts:
    - source: app/routes
      target: content
```

and voila, just like that I can use the hugo cli and the workflow I love, in a react environment. Small win ♥


## Link to the repo
- [Github](https://github.com/txndai/remixgoose)
## Hugo Docs used
- [Hugo New](https://gohugo.io/commands/hugo_new/#readout)
- [Archetype](https://gohugo.io/content-management/archetypes/#readout)
- [Github issue](https://github.com/gohugoio/hugo/issues/6010) that gave me a clue
- [Module Config: mounts](https://gohugo.io/hugo-modules/configuration/#module-config-mounts)