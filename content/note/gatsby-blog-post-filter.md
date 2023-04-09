---
date: "2020-10-01"
title: "Gatsby Blog Posts Filter - How I made it work"
tags: ["documentation", "gatsby"]
description: 'A few snippets and steps on how I made the blog post filter work.'
---

In attempt to make sifting through articles easier for the reader, I figured a filter would be just enough. The only issue is that all tutorials on how to filter gatsby(and react too? I don't remember if I looked for react specific tutorials, lol) blog posts, were the kind that would have me generate a separate page with tag lists, and that felt like too much. 

The solution I wanted, is one that would filter same page posts. I'm rambling now, let's get to code snippets.

## GraphQL query
First call of duty was querying all categories from all the blog posts' frontmatter: 

```graphql
categories: allMarkdownRemark(filter: {frontmatter: {article: {eq: "true"}}}) {
    nodes {
        frontmatter {
            category
        }
    }
}
```
this returns an array of objects - also worth noting, it pulls the categories on each blog post, meaning there will be a ton of repeats🙄:

```json
{
  "data": {
    "allMarkdownRemark": {
      "nodes": [
        {
          "frontmatter": {
            "category": [
              "log"
            ]
          }
        },
        {
          "frontmatter": {
            "category": [
              "log",
              "UI"
            ]
          }
        },
        {
          "frontmatter": {
            "category": [
              "music"
            ]
          }
        },
        {
          "frontmatter": {
            "category": [
              "TIL"
            ]
          }
        },
      ]
    }
  }
}
```

## Javascript time😏
All of these snippets are in the `blog.js` page.

First, initialize an empty array `let initialCatArray = []` - this will help house the categories from the *GraphQL query* above.

### populating initialCatArray
```js
data.categories.nodes.forEach(post => {
    initialCatArray = initialCatArray.concat(post.frontmatter.category)
  });
```
`console.log(initialCatArray)` at this point will give the output 
```
log,log,UI,music,TIL,playlist,podcast,web,music,web,music,gatsby,documentation,documentation,gatsby
```

### Function countCategoryAppearance
I first came across this bad boy whilst going through Wes Bos's [Javascript30](https://javascript30.com/). What it does is take the current state of `initialCatArray`, and counts how many times each entry repeats:

```js
function countCategoryAppearance(params) {
  // this function takes an array, counts the number of appearances of an entry, and returns an object as the result
  const countedObject = params.reduce(function(obj, item) {
    if (!obj[item]) {
        obj[item] = 0;
    }
    obj[item]++;
    return obj;
}, {});
return countedObject
}
```
and it returns a neat object that looks like so:
```json
{
    TIL: 1
    UI: 1
    documentation: 2
    gatsby: 2
    log: 2
    music: 3
    playlist: 1
    podcast: 1
    web: 2
}
```

### Converting the object into an array
`Object.keys` easily does the trick - converts the object above into an array, but without the values, it only returns the keys:
meaning that this:
```js
const theKeys = Object.keys(countCategoryAppearance(initialCatArray))
//countCategoryAppearance is what returned the object in the code block above
```

returns that:
```js
["log", "UI", "music", "TIL", "playlist", "podcast", "web", "gatsby", "documentation"]
```

This array is what I'll use to render the filter buttons.
So much work for so little 😒

### Time to useState
I should probably read the State Hook [documentation](https://reactjs.org/docs/hooks-state.html) soon😅. In any case, this is where `useState` comes in.
```js
const [catFilter, setFilter] = useState('');
```
This is what takes care of the Filter state, and `onClick` of the filter buttons, catFilter state is updated to the selected/clicked category.
```js
<button onClick={()=> setFilter('')}>All</button>
{theKeys.map(category => (
    <button 
    onClick={()=> setFilter(category)} 
    key={category}>
            {category}
    </button>
))}
```
In order to 'reset' state and render all blog posts, I figured the easiest way was to add manually add a button above the generated ones. 

### Using arrays to render blog cards
Now, there's two arrays at play when it comes time to render the blog posts - The original-unfiltered-allBlogPosts array(`data.posts.edges`), and the `filtered` array, which changes when `catFilter` state is updated.

the filtered array makes use of [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), no magic here.
```js
const filtered = data.posts.edges.filter((post)=> post.node.frontmatter.category.includes(catFilter))
```

### Finally, rendering desired blog post cards
```js
{
(catFilter ? filtered : data.posts.edges).map(post => (
    <div key={post.node.id} className="p-4 md:w-1/3">
    <PostCard 
        category={post.node.frontmatter.category}
        title={post.node.frontmatter.title}
        summary={post.node.frontmatter.summary}
        image={post.node.frontmatter.image.childImageSharp.fluid}
        path={post.node.frontmatter.path} />
    </div>
))}
```
Using a ternary operator, I check `catFilter` for a [truthy](https://www.freecodecamp.org/news/falsy-values-in-javascript/), in order to render the `filtered` array, else it renders all blog posts, if a [falsy](https://www.freecodecamp.org/news/falsy-values-in-javascript/) is returned. 

The code is messy, but it does **exactly** what I want, which is nice.