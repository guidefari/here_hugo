---
title: "Hugo site OG Images using Node and Cloudinary"
date: 2022-05-27T09:30:21+02:00
description: After months of procrastinating, I finally have a solution for Open Graph Images on this site
tags: [hugo, nextjs, node]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Hugo%20site%20OG%20Images%20using%20Node%20and%20Cloudinary']
---

## Acknowledgements
Before we go far big thanks to:
- [Bhekani](https://blog.bhekani.com/) for validating my approach before I got started, as well as helping me iron out a few grey areas, and solving a bug I was stuck on for a few hours:)
- [Flavio Copes](https://flaviocopes.com/canvas-node-generate-image/) laid the framework for how the problem can be solved in the context of Hugo.
- [Colby Fayock](https://www.colbyfayock.com/) for taking me through Cloudinary.

Standing on the shoulders of giants:)

## Problem
I have a lot of posts on this site, it's all markdown, & I needed a way to automate how Open Graph images are taken care of. I used to manually create & self host images for [my old site](https://www.goosebumps.co.zw/), and that was very painful, because time & effort, hosting them next to my markdown files would make the repo balloon in size. Having to manually create an image for each post resulted in me not writing as frequently as I'd have liked to, because of the extra chore!

## High level overview of the solution
The solution is surprisingly basic, create a node server that uses query params to figure out the custom text to be used on the, and return an image resource. I was gonna use node & canvas for this, but Bhekani recommended I try out cloudinary, so I took that approach instead.

# Node server code
Needed something to get up & running real quick, so I just went with a [NextJS API](https://nextjs.org/docs/api-routes/introduction), hosted on [vercel](https://vercel.com/).

> Make it work, make it right, make it fast

**pages/api/og-image.js**
```js
import { v2 as cloudinary } from "cloudinary"
import url from "url"

export default async function handler(req, res) {
  const { title } = url.parse(req.url, true).query

  cloudinary.config({
    cloud_name: YOUR_CLOUD_NAME,
  })

  const cloudinaryTemplateImageURL = cloudinary.url(
    "v1653576865/blog/somethingsomething.png",
    {
      width: 1012,
      height: 506,
      transformation: [
        {
          fetch_format: "auto",
          quality: "auto",
        },
        {
          color: "#E9EB9E",
          crop: "fit",
          width: 600,
          overlay: {
            font_family: "Roboto Mono",
            font_size: "55",
            font_weight: "extra_bold",
            text: title,
          },
        },
        {
          flags: "layer_apply",
          gravity: "north_west",
          x: 374,
          y: 128,
        },
        {
          color: "#7DA9B9",
          crop: "fit",
          width: 600,
          overlay: {
            font_family: "Roboto Mono",
            font_size: "48",
            font_weight: "extra_bold",
            text: "guidefari.com",
          },
        },
        {
          flags: "layer_apply",
          gravity: "south_west",
          x: 374,
          y: 53,
        },
      ],
    }
  )

  const response = await fetch(cloudinaryTemplateImageURL)
  const buffer = await response.buffer()

  res.send(buffer)
}

```

### Cloudinary template image
From the snippet above, `v1653576865/blog/somethingsomething.png` is the cloudinary URL of the template image, and this is how it looks:

![Guidefari.com template OG image](https://res.cloudinary.com/hokaspokas/image/upload/v1653573428/here-hugo/social-card_jxxtbz.svg)

*Illustration was done by [Thando](https://www.instagram.com/thandofficial/)*

### Hugo frontmatter
This is what the frontmatter for this post looks like:
```yaml
---
title: "Hugo site OG Images using Node and Cloudinary"
date: 2022-05-27T09:30:21+02:00
description: After months of procrastinating, I finally have a solution for Open Graph Images on this site
tags: [hugo, nextjs, node]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Hugo%20site%20OG%20Images%20using%20Node%20and%20Cloudinary']
---
```

I also use hugo archetypes to quickly scaffold markdown files with pre-filled details.

# Tutorials & docs used
- [Cloudinary Node.js image transformations](https://cloudinary.com/documentation/node_image_manipulation)
- {{<youtube WYTjd3yl5-g>}}
- [Hugo frontmatter](https://gohugo.io/content-management/front-matter#readout)
- [Hugo archetypes](https://gohugo.io/content-management/archetypes)
- [URL encode text](https://onlinetexttools.com/url-encode-text)