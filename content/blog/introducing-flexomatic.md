---
title: "Introducing Flexomatic"
date: 2018-04-26T11:10:00-05:00
slug: "introducing-flexomatic"
description: "I've been working hard on my first open source React component library. After a few weeks I just released the first version of flexomatic. Let me tell you all about it."
keywords: ["javascript", "react", "components", "styled-components"]
tags: ["React", "Open source"]
draft: false
stylesheet: "post.css"
---

I'm really excited to announce my first open source library, [flexomatic](https://github.com/jakewies/flexomatic), a flexbox-based grid system for React built with `styled-components`. It follows the methodology proposed by Philip Walton's [Solved By Flexbox](https://philipwalton.github.io/solved-by-flexbox/) grid system. Version 1.0.0 has been officially released on `npm`.

_UPDATE: As of writing this Version 1.1.0 has been released along with a [shiny documentation site](https://flexomatic.netlify.com/)_!

## Backstory

I had been working on a small side-project when I ran into a situation where I wanted to have a grid system. I mulled over a few existing implementations before deciding to roll my own. There were two main reasons for this:

### I have never _truly_ open sourced anything

This was the main reason. I want to experience what building and maintaining an open source library is like for some time. I know I will attain a great deal of knowledge from doing so. Plus, it's an interesting project that could benefit others.  

### I haven't seen the _Solved By Flexbox_ grid system in React

There are a few really awesome grid systems for React out in the wild. Just peruse the [grid systems section](https://github.com/styled-components/awesome-styled-components#grid-systems) of the _awesome styled-components_ GitHub repo and you'll see what I mean. I could have easily reached for any of these solutions and I would have saved a lot of time on my initial side project. 

But I really enjoyed the implementation Philip Walton proposed. It's minimal and it doesn't weigh the user down with a bevy of options. I like minimal. For my use case it works, and I think it fits in well as a solution for anyone who just wants a basic grid.

> "Grid systems usually come with a myriad of sizing options, but the vast majority of the time you just want two or three elements side-by-side." - Philip Walton

The quote above perfectly describes what `flexomatic` aims to achieve. Not too much. Not too little. Just right.

## Getting started

```shell
$ yarn add flexomatic

# or

$ npm install flexomatic
```

**Note**: `flexomatic` has a `peerDependency` on `styled-components`. In order to use it you must have `styled-components` already installed in your project.

## Features

`flexomatic` exposes two components, a `Grid` and a `Cell`.

```jsx
import React from 'react'
import { Grid, Cell } from 'flexomatic'

const App = () => (
  <Grid>
    <Cell>1</Cell>
    <Cell>2</Cell>
    <Cell>3</Cell>
  </Grid>
)
```

Staying true to the Solved By Flexbox implementation:

- `Cell` components default to the same width, but can be adjusted individually
- You are able to adjust the alignment of `Cell` components as a group or individually
- Responsive, mobile-first with media query support
- `Grid` components are nest-able

## Looking ahead

I will continue to improve upon `flexomatic` and hopefully be able to learn more about open source through my efforts. 

You can check out the [docs](https://flexomatic.netlify.com) for examples and usage. Built with [NextJS](https://github.com/zeit/next.js/)!

If you have any questions feel free to reach out on [Twitter](https://twitter.com/jakewies) or file an issue on [GitHub](https://github.com/jakewies/flexomatic). Contributions are always welcome!







