---
title: "TIL: Array Map Async Callback"
date: 2022-10-02T04:00:56+02:00
description: Running array.map with an async operation as the callback was causing me issues.
tags: [til, javascript, async]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=TIL%3A%20Array%20Map%20Async%20Callback']
---

This questioned my knowledge of asynchronous javascript in general, and forced me to slow down for a second to take a refresher. 

Ultimately, wrapping the array.map with a `Promise.all()` fixed the problems I was having

- This short article [helped](https://advancedweb.hu/how-to-use-async-functions-with-array-map-in-javascript/)

```tsx
export const getStaticProps = async () => {
  const tweets = await Promise.all(
    tweetFilePaths.map(async (filePath) => {
      const source = fs.readFileSync(path.join(TWEETS_PATH, filePath))
      const { content, data } = matter(source)

      const serialized = await serialize(content)
      return serialized
    })
  )

  return { props: { tweets } }
}
```