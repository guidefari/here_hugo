---
date: "2021-02-18"
tags: ["documentation", "nextjs"]
title: "NextJs Project structure"
summary: "Quick explanation of the project structure from the PICH website for project handover"
---

# /

### .eslintrc
uses a configuration set up by Wes Bos 

- [src repo](https://github.com/wesbos/eslint-config-wesbos)
- [YT video](https://www.youtube.com/watch?v=lHAeK8t94as&ab_channel=WesBos)

```json
{
    "extends": [
      "wesbos"
    ]
  }
```

### netlify.toml
This is to set up your netlify deploy using a config file, instead of the GUI.
- [netlify docs - file based configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)

### next.config.js
To optimize images hosted on another domain other than your own.
- [Nextjs docs](https://nextjs.org/docs/basic-features/image-optimization#domains)
```js
  images: {
    domains: ['images.unsplash.com'],
  }
```
- [raw-loader docs](https://www.npmjs.com/package/raw-loader)
- follow [this](https://www.pullrequest.com/blog/build-a-blog-with-nextjs-and-markdown/) tutorial to get some context of why we need this.
```js
webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  }
```

# /public
This is where all the static assets live:

- fonts
- images
- logos

- [Nextjs docs](https://nextjs.org/docs/basic-features/static-file-serving) - static file serving

# /pages
All site pages live here. `[slug].js` files are the pages that make use of [Dynamic routing](https://nextjs.org/docs/routing/dynamic-routes). That concept took me a while to wrap my head around, so don't sweat it if you don't get it the first time round or immediately.

## /pages/_app.js
Global component. In our case, it's used to import the global css, and write some basic site wide meta tags.
- [NextJS docs](https://nextjs.org/docs/advanced-features/custom-app)

# /css
### index.css
the only thing to note here is the [import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) of the `fonts.css` file.

# /lib
I don't think the `posts.js` file is still being used😅

# /components
These are grouped in folders that follow a subjective hierarchy. the sub folders so far are
- Author - All author specific components
- Home - All components that are used on the home page
- Layout - `header`, `footer` & `layout` component. `layout.jsx` is what ties them together, and makes use of the [`{children}` prop](https://www.netlify.com/blog/2020/12/17/react-children-the-misunderstood-prop/).

## /components/seo.js
This is the seo component I've been using for my react projects. I'm happy to explain any line of this code, the goal is for you to be able to explain what each line is doing in natural language, and it touches on a few ES6 concepts - so take your time with it.

## /components/share.js
this is what's used to implement the social media share. uses the [react-share](https://www.npmjs.com/package/react-share) package.