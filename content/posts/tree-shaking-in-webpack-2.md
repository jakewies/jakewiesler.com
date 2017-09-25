---
title: "Tree Shaking in Webpack 2"
date: 2017-09-21T19:15:34-04:00
draft: true
stylesheet: "post.css"
---

Webpack 2 is still in its beta stage at the time of writing this, but should see its release very soon. It brings with it a variety of anticipated features. One of those features includes native support for ES6 modules.

### So what? 

So instead of using the `var module = require('module')` syntax, webpack 2 supports ES6 `imports` and `exports`. This proves quite powerful, and opens the door for some code optimizations such as **tree-shaking**.

## What is tree-shaking?

Popularized by Rich Harris' [Rollup.js](http://rollupjs.org/) module bundler, *tree-shaking* is the ability to only include code in your bundle that is being *used.* When I first played around with Rollup, I was amazed at how well it worked with ES6 modules. The development experience just felt...right. I can create separate modules written in \"future JavaScript\", and then include them anywhere in my code. Any code that goes unused doesn't make it into my bundle. Genius! 

### What problem does it solve? 

If you're writing JavaScript in 2017 and *understand* (see: [JavaScript fatigue](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f#.nk6chuvta)) the various tools around, your development experience probably feels pretty fluid. This is important, but what's also important is *user experience*. A lot of this modern tooling ends up bloating web applications with massive JavaScript files, resulting in performance loss.What I love about Harris' Rollup is that it takes a stab at this issue and brings a solution to the forefront of the JavaScript community. Now big names like webpack are attempting to iterate on it. 

#### A simple example

Before we get started I want to provide you with a trivial example of tree-shaking. Our application is made up of 2 files, `index.js` and `module.js`. 

(https://medium.com/@roman01la/dead-code-elimination-and-tree-shaking-in-javascript-build-systems-fb8512c86edf#.69aadkgrb), and he made a great analogy in order to visualize the concept of tree-shaking:

> If you wonder why it’s called tree-shaking: think of your application as a dependency graph, this is a tree, and each export is a branch. So if you shake the tree, the dead branches will fall. 

## Tree-shaking in webpack 2

Unfortunately for those of us using webpack, tree-shaking is \"behind a switch\", if you will. Unlike Rollup, some configuration needs to be done before we can get the functionality we're looking for. The \"behind a switch\" part might confuse some people. I'll explain.

### Step 1: Project setup

I'm going to assume that you understand webpack basics and can find your way around a basic webpack configuration file. Let's start by creating a new directory:

```
\nmkdir webpack-tree-shaking && cd webpack-tree-shaking\n
```

Once inside, let's initialize a new `npm` project:

```\nnpm init -y\n```

The `-y` option generates the `package.json` quickly without requiring you to answer a bunch of questions. \n\nNext, let's install a few project dependencies:

### Step 3: Webpack from the CLI

Since it's minified, go ahead and search for `Hello`. It *should* be there. Search for `Bye`. It *shouldn't*. Voila! We now have a working implementation of tree-shaking in webpack 2! For the curious, I've been slowly iterating over my own lightweight webpack configuration in a [GitHub Repo](https://github.com/jake-wies/webpack-hotplate). It's not meant to be overly verbose and bloated. It's focused on being an approachable boilerplate with walkthroughs at every turn. If you're interested, check it out!"