---
title: "Getting Started with React Hooks"
date: 2018-11-09T07:57:00-05:00
slug: ""
description: "React hooks are functions that expose certain features previously unavailable to functional components such as state and lifecycle. They were announced at ReactConf 2018 and are an experimental proposal as of writing this. React hooks are slated to become official in the v16.7.0 release. This post will walk you through how to get started using them."
keywords: ["React", "hooks", "JavaScript"]
draft: true
tags: ["React"]
stylesheet: "post.css"
---

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
