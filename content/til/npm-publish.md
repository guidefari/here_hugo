---
title: "TIL: How to publish an npm package"
date: 2023-08-13T08:20:19+02:00
description: Also set up an automated way to do it, leveraging Github Actions. With changelogs & versioning
tags: [til]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=']
---

# Context
I've been trying to learn Effect-TS by working on a little http-client for the spotify api.
It ain't much yet, but one of the goals in this project was learning how to publish an npm package.

Quite happy with the workflow so far.

- [My Repo](https://github.com/txndai/spotify-effect)
- [npm package - (spotify-effect)](https://www.npmjs.com/package/spotify-effect?activeTab=readme)

Now, onto how it's done.

# [Changesets](https://github.com/changesets/changesets)
This tool does a lot of the publishing heavylifting.
- Maintaining the changelog
- Publishing to npm after merging into main and providing a changeset
- Coupled with github actions to automate the process

# Permissions (npm & repo)
- You need to create a token on npmjs.org
- Add that token to your repo's environment variables. Mine's named `NPM_TOKEN`
- Add the [changeset bot](https://github.com/apps/changeset-bot) to your repo
- Navigate to `Repo settings > Actions > General > Workflow permissions`
and **allow read and write permissions**,
and also **allow github actions to create and approve pull requests**

# Challenges I faced
I had the release workflow running, but it wasn't publishing the package to npm.

Running `changeset publish` was givinig me the following output

```bash
🦋  warn No unpublished projects to publish
```

Ultimately, I made these changes and things resolved themselves:


### spotify-effect/package.json
```diff
- "private": "false",
+   "publishConfig": {
+    "access": "public"
+  },
```

### spotify-effect/.changeset/config.json
```diff
-  "access": "restricted",
+  "access": "public",
```

# Learning Resources
- Matt Pocock was a big help
  - [quick video](https://www.youtube.com/watch?v=eh89VE3Mk5g)
  - [full video](https://www.youtube.com/watch?v=aKTSC4D1GL8) 
  - [repo](https://github.com/mattpocock/pkg-demo)
- [Changeset Release Action](https://github.com/changesets/action)
- [Tobias Davis' "Adding Changesets to Your GitHub Repository"](https://davistobias.com/articles/adding-changeset) 
- [Web Dev Simplified's video](https://www.youtube.com/watch?v=J4b_T-qH3BY)
- [Github's Publishing Node.js packages](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)
was pretty helpful too
