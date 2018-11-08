---
title: "A Primer on React Hooks"
date: 2018-11-09T07:57:00-05:00
slug: ""
description: "React hooks are functions that expose certain features previously unavailable to functional components such as state and lifecycle. They were announced at ReactConf 2018 and are an experimental proposal as of writing this. React hooks are slated to become official in the v16.7.0 release. This post will walk you through how to get started using them."
keywords: ["React", "hooks", "JavaScript"]
draft: true
tags: ["React"]
stylesheet: "post.css"
---

On the afternoon of October 25th I hastily shuffled my work to the side and fired up YouTube, knowing that the ReactConf 2018 keynote was minutes away from starting. This would be the first conference keynote I watch live, and I wanted no interruptions. As the next two hours began to unfold I realized I was witnessing a significant moment for React. An evolution of the library. 

Coming off the heels of a [strong `v16.6.0` release](/blog/whats-new-in-react-16.6.0/), the React core team announced [hooks](https://reactjs.org/docs/hooks-intro.html), a feature proposal that exposes certain capabilities to functional components such as state and lifecycle. These capabilities were previously limited to class components. 

You can watch the entire keynote along with a follow up talk from [Ryan Florence](https://twitter.com/ryanflorence) in this [YouTube video](https://www.youtube.com/watch?v=dpw9EHDh2bM). If you have 90 minutes to kill I encourage you to watch. 👀

Still here?

{{< gif src="https://media.giphy.com/media/1034EEGrn91SrS/giphy.gif" caption="Cool beans, man." >}}

Before we begin I must tell you that this is an **experimental proposal**. Nothing you see here should be considered final. There is currently an [open RFC](https://github.com/reactjs/rfcs/pull/68) where you can stay current on the proposal, and even voice your concerns if you have any.

{{% h2 %}}What are hooks?{{%/ h2 %}}

As I stated earlier, **React hooks** are a way for functional components to access certain features previously unavailable to them. The obvious ones being state and lifecycle. They are **not** to be used in class components.

Here's another definition from the [React docs](https://reactjs.org/docs/hooks-overview.html#but-what-is-a-hook):

> Hooks are functions that let you “hook into” React state and lifecycle features from function components.

This is a major shift, both technical and conceptual. However, hooks come with no breaking changes. They're backwards compatible and opt-in, meaning you as a developer don't need to use them at all. If that's your prerogative. It's an impressive selling point.

{{% h2 %}}What problems do they solve?{{%/ h2 %}}

The [Motivation](https://reactjs.org/docs/hooks-intro.html#motivation) section of the official docs details specific problems that the React core team believes hooks solve, so I won't regurgitate those here. However, I do want to add my own point of view.

### Moving away from classes

I've had a strange relationship with classes in JavaScript. Sort of like a monster in my closet that I refuse to acknowledge. JS is my first programming language, and I definitely haven't worked with another that has classes in the traditional sense. 

I've heard that classes in JS are *different* than classes in other languages. This leaves an empty spot in my brain, as if I need to go figure out what those differences are. I still haven't.

I've heard that you should avoid classes in JS. In fact, I heard this before I started working with React at all, so you can imagine my confusion when coming to the library and realizing that classes were fundamental. 

The introduction of hooks is an indicator that the core team sees value in functional components over the long term, and there are [clear reasons](https://reactjs.org/docs/hooks-intro.html#classes-confuse-both-people-and-machines) to prefer them over class components. That being said, I don't think we will see class components phased out any time soon, if ever. This would go against React's seemingly backwards compatible mindset. Imagine all of the code that would be affected by such a change!

### More functional components

The longer I do this whole programming thing the more I discover about myself. One of those discoveries is that I *love* writing functions. It doesn't matter the language. 

I once read (and didn't finish) an oft-cited book in the realm of programming called [Structure and Interpretation of Computer Programs](http://web.mit.edu/alexmv/6.037/sicp.pdf). It comes with a slew of example code that you can work through in [Scheme](https://en.wikipedia.org/wiki/Scheme_(programming_language)), a dialect of the Lisp programming language. It was my first *real* introduction to the functional programming paradigm, and man was it cool. I loved it. I should finish that book someday.

I digress. Where were we? Ah yes, *functions*. Building user interfaces with functions as my building blocks seems to make a whole lot of sense. The composibility is there. The developer experience just feels right. I lose that feeling when I'm trying to refactor some voluminous class in my codebase.

And what's even better is that hooks are functions *too*! The [official docs](https://reactjs.org/docs/hooks-intro.html#its-hard-to-reuse-stateful-logic-between-components) state that reusing stateful logic is one of the motiviations of hooks. It's going to be such a powerful pattern. I'm imagining all of those providers, all of those render props and all of those higher-order components slowly washing away. What a beautiful thought.

{{% h2 %}}Getting started with hooks{{%/ h2 %}}

You can get started with hooks using React `v16.7.0-alpha`. I've set up a [CodeSandbox](https://codesandbox.io/s/1z16jj9y24) that will get you going quickly if you want to follow along with the examples below.

React comes with some [built-in hooks](https://reactjs.org/docs/hooks-reference.html) that focus on doing one thing, such as providing state or context to a functional component. You can also use these as building blocks to create [your own hooks](https://reactjs.org/docs/hooks-custom.html).

{{% h3 %}}`useState`{{%/ h3 %}}

The `useState` hook allows a functional component to keep some local state. It's a function that accepts an initial state value and returns an array with 2 items: 

1. The current value of the state 
2. A function that can be called to update the state

```jsx
import React, { useState } from 'react'

function StreetLight() {
  const [color, setColor] = useState('GREEN')
}
```

Because of the way array destructuring works, we can name the items returned by `useState` anything we want. There is no constraint imposed on us by the API. As a convention, it seems that the React ecosystem is taking to the `[value, setValue]` syntax. 

In the example above, `color` is the state value and is initialized to `'GREEN'`. The `setColor` function can be called to update that value.

Note that, unlink a class component, state in a functional component **does not** need to be an object. Here it's just a string. 

Another important note is that the update function, in this case `setColor`, does not *merge* the new state with the current, but instead _overrides_ it completely. This is different from how `this.setState` works in class components.

### Updating state

The value of `color` will be preserved between re-renders (more on this below), *unless* the `setColor` function is called with a new value:

```jsx
function StreetLight() {
  const [color, setColor] = useState('GREEN')
  const slow = () => setColor('YELLOW')
  
  return (
    <button onClick={slow}>Slow down!</button>
  )
}
```

When the button is clicked, the `setColor` method is called with a value of `'YELLOW'`. This will cause the `StreetLight` component to re-render. When it does, the `color` variable will be updated with the value `'YELLOW'`. 

### Wait, what?

This is where things start to get dicey. At first glance, you would think that every time `StreetLight` renders, it calls `useState` with a value of `'GREEN'`. So how can `color` be anything *but* green?

A logical question. Here are a few lines from the [React docs](https://reactjs.org/docs/hooks-state.html#declaring-a-state-variable) that may help _ease_ you in to this concept:

> "Normally, variables 'disappear' when the function exits but state variables are preserved by React."

> "React will remember its current value between re-renders, and provide the most recent one to our function."

> "You might be wondering: why is useState not named createState instead? 'Create' wouldn’t be quite accurate because the state is only created the first time our component renders. During the next renders, useState gives us the current state."

_But how?_ 

Put simply, React [keeps track](https://reactjs.org/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components) of calls to `useState` (and all other hooks) internally. It will also create a mapping between the update function and the state value for which it updates. 

The initial value passed to `useState` is returned on the first render, but from there React will return the correct value based on the mapping. It also uses the map to know which slice of state to mutate when the update function is called.

If this seems confusing to you, you're not alone. I was baffled by how this could work as well. My confusion only increased when I found out that [you can have multiple calls](https://reactjs.org/docs/hooks-overview.html#declaring-multiple-state-variables) to `useState` in the same component:

```jsx
function StreetLight() {
  const [color, setColor] = useState('GREEN')
  const [broken, setBroken] = useState(false)
  // ...
}
```

Yes, you can do this until your heart's content.

### How does React keep track of the state? 

In order for all of this to work, React expects that you follow [a few rules](https://reactjs.org/docs/hooks-rules.html#explanation):

1. Only call hooks at the top level of a function
2. Only call hooks from functional components and [custom hooks](#writing-a-custom-hook)

Notice how I'm using the plural "hooks" instead of referring to `useState` specifically. These rules apply to _all_ hooks, both built-in and custom. I'm mentioning these rules now because having multiple calls to `useState` in a single component is a perfect example of why you would want to follow them. Keep this in mind as we move forward.

React imposes these rules on us because it [relies on the call order of hooks](https://reactjs.org/docs/hooks-rules.html#explanation) to manage data properly. This may seem fickle at first, but these rules aren't hard to follow. And quite frankly I can't think of a scenario where we'd want to break them.

In order to internalize how all of this works better, I _highly_ recommend reading [this Medium post](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e) by [Rudi Yardley](https://medium.com/@ryardley). Stop now and read! It's the best content on hooks you will find. Better than this. Seriously. 📚

{{% h3 %}}`useEffect`{{%/ h3 %}}

The next hook on the list is `useEffect`. I find this one to be a welcomed addition to React for one purpose: to tighten up code that belongs together but is separated between multiple lifecycle methods. The methods I'm referring to are:

- `componentDidMount`
- `componentDidUpdate`
- `componentWillUnmount`

I can't tell you how many times I've needed to execute code in 2 or more of these methods that relate to the same concern. Now, with `useEffect`, that code can live in one place.



{{% h3 %}}Writing a custom hook{{%/ h3 %}}
