---
date: "2020-08-15"
tags: ["gatsby", "documentation"]
title: "My social card struggle with React Helmet"
summary: "A breakdown of the problem I've faced whilst trying to get my links to turn into sharing cards when shared on social media."
---
`status: fixed`

I've been fighting against [react-helmet](https://www.gatsbyjs.com/plugins/gatsby-plugin-react-helmet/?=react%20helmet) for a while now, and debugging the issue has left me with conflicted views. My SEO knowledge is a bit basic, that might explain why I'm struggling to catch the issue.

I'll break down the article into 2 parts:

1. The set up of the site
2. The problem & debugging attempts

# 1. Site setup

The site is build using GatsbyJS, and has an SEO component that makes use of react-helmet, which is available as a [GatsbyJS plugin](https://www.gatsbyjs.com/plugins/gatsby-plugin-react-helmet/?=react%20helmet).
There are 5 'hard-coded' [pages](https://github.com/txndai/great-gatsby/tree/master/src/pages) (404, index, blog, about, contact), and the blog posts are programmatically generated (explained in the Gatsby docs [here](https://www.gatsbyjs.com/docs/programmatically-create-pages-from-data/#reach-skip-nav).
The tutorial I followed to implement the SEO component is taken from Gatsby [docs](https://www.gatsbyjs.com/docs/add-seo-component/").

## Relevant file links

- [repo](https://github.com/txndai/great-gatsby)
- [seo component](https://github.com/txndai/great-gatsby/blob/master/src/components/seo.js)
- [gatsby config](https://github.com/txndai/great-gatsby/blob/master/gatsby-config.js)

## Code snippets

The seo component can take the following props:

```jsx
const SEO = ({ title, description, image, article }) => { ... }
```

And it also has fallback values, incase I don't pass down all props:

```jsx
const {
    defaultTitle,
    titleTemplate,
    defaultDescription,
    siteUrl,
    defaultImage,
    twitterUsername,
  } = site.siteMetadata
```

siteMetadata (containing default/fallback values) in the SEO component comes from the static graphql query:


```jsx
const query = graphql`
  query SEO {
    site {
      siteMetadata {
        defaultTitle: title
        titleTemplate
        defaultDescription: description
        siteUrl: url
        defaultImage: image
        twitterUsername : author
      }
    }
  }
`
```


the query gets the data from gatsby-config.js:

```jsx
module.exports = {
  siteMetadata: {
    title: `Goosebumps Collective`,
    titleTemplate: "%s · Goosebumps Collective",
    description: `Freelance Web Development & Curated Music`,
    url: "https://goosebumps.co.zw",
    image: `/goose.png`,
    author: `@txndai`,
  }
}
```

Default values & react-helmet structure:

```jsx
const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  }

  return (
    <Helmet title={seo.title} titleTemplate={titleTemplate}>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />

      {seo.url && <meta property="og:url" content={seo.url} />}

      {(article ? true : null) && <meta property="og:type" content="article" />}

      {seo.title && <meta property="og:title" content={seo.title} />}

      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}

      {seo.image && <meta property="og:image" content={seo.image} />}

      <meta name="twitter:card" content="summary_large_image" />

      {twitterUsername && (
        <meta name="twitter:creator" content={twitterUsername} />
      )}

      {seo.title && <meta name="twitter:title" content={seo.title} />}

      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}

      {seo.image && <meta name="twitter:image" content={seo.image} />}
    </Helmet>
  )
}

export default SEO
```

# 2. Problem + Debugging attemps

You'd think I have all my bases covered. When I share links to any page on the website, it remains as just a text link, and no card appears. I've tried Twitter, WhatsApp, & Facebook.

When I submit a [url](https://www.goosebumps.co.zw/playlists-for-coding/) on [Twitter Card Validator](https://cards-dev.twitter.com/validator), the log I receive is:

```
INFO:  Page fetched successfully
INFO:  3 metatags were found
ERROR: No card found (Card error)
```

I've been receiving that error from the get go (a good couple of weeks at the time of writing), and the case remains the same, as I have just tried this [url](https://www.goosebumps.co.zw/playlists-for-coding/).

## Other social card validators

I've also tried [iframely](http://debug.iframely.com/?uri=https%3A%2F%2Fwww.goosebumps.co.zw%2Fplaylists-for-coding), [socialsharepreview](https://socialsharepreview.com/?url=https://www.goosebumps.co.zw/playlists-for-coding/), [metatags.io](https://metatags.io) - all with fairly positive results, indicating that there's a title, description, & image (all open graph).


The `<head>` element of all pages seem to have all the meta required, so I can't quite tell where my main issue lies.<br>

# Fix
Turns out the fix was as simple as opening `tailwind.config.js`, and adding `purge: ["./src/**/*.js"]` in the `module.exports` object.
At some point, after iterating the SEO component further, the error being returned by the Twitter card validator was `error "response is too large"`. [This](https://tailwindcss.com/course/optimizing-for-production#app) is why you should purge unused classes generated by tailwind.

### links
- npm: [react-seo-component](https://www.npmjs.com/package/react-seo-component) - this may be a more consistent approach to SEO across projects, especially since I've been switching between NextJS & GatsbyJS sites 🤔