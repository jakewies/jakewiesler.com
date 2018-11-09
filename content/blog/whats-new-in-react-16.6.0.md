---
title: "What's New in React v16.6.0"
date: 2018-11-01T09:19:29-04:00
slug: ""
description: "The React core team recently released v16.6.0 of the library, which includes some long anticipated features such as native support for dynamic imports and memoization for function components. Let's dive in and talk about these new additions."
keywords: ["React", "JavaScript", "Front-end"]
draft: false
tags: ["React"]
stylesheet: "post.css"
---

The `v16.6.0` release of React includes some highly anticipated features such as native support for dynamic imports and memoization for function components. This is a big release for the library and community at large. Some of these features will have a major impact on how we compose UI moving forward. 

This post will focus on covering the features I find most intriguing:

- `React.lazy`
- `React.Suspense`
- `React.memo`
- `static contextType`

Let's dive in!

{{% h2 %}}`React.lazy`{{%/ h2 %}}

The term **lazy loading** has been around for a while, and the idea is pretty simple: _to load some slice of code when it's needed._ It is a technique used in **code splitting**, which involves breaking up your app into separate bundles which can be loaded on demand.

With the `React.lazy` API, you can now load components _dynamically_ - only when they need to render.

```jsx
import React, { lazy } from 'react'

const LazyComponent = lazy(() => import('./LazyComponent'))
```

`React.lazy` takes a function that returns a dynamic import. The module being imported  [must have a default export containing a React component](https://reactjs.org/docs/code-splitting.html#reactlazy).

In the example above, `LazyComponent` is not an actual component..._yet_. It's a dynamic import that can be rendered in your JSX as if it _were_ a component.

```jsx
import React, { lazy } from 'react'

const LazyComponent = lazy(() => import('./LazyComponent'))

function App() {
  return (
    <div>
      <LazyComponent />
    </div>
  )
}
```

When `App` renders, `LazyComponent` will be loaded in a separate bundle. But what happens if it hasn't loaded by the time `App` is finished rendering?

```
Error: An update was suspended, but no placeholder UI was provided.
```

{{< note >}}Oops!{{</ note >}}

That happens. Not ideal. Luckily, there is a simple solution in the form of `React.Suspense`.

{{% h2 %}}`React.Suspense`{{%/ h2 %}}

To prevent the error above from happening, you can wrap a lazy component in the new `React.Suspense` component, which provides some fallback UI to show while the component loads.

```jsx
import React, { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('./LazyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
``` 

`React.Suspense` requires a single `fallback` prop, and its value should be a React element you wish to show while a dynamically imported component is being loaded.

You don't need to render a `React.Suspense` component _directly above_ a lazy-loaded component. Instead, React will look for the closest `React.Suspense` parent and use its fallback UI.

```jsx
<Suspense fallback={<div>Loading...</div>}>
  <div>
    <div>
      <LazyComponent />  
    </div>
  </div>
</Suspense>
```

Another cool feature about `React.Suspense` is that it can be used to wrap multiple components being dynamically imported with `React.lazy`. It's not limited to just one.

```jsx
<Suspense fallback={<div>Loading...</div>}>
  <LazyOne />
  <LazyTwo />
</Suspense>
```

There is a clear synergy between `React.lazy` and `React.Suspense`. You could have done dynamic importing before with something like `webpack`, but it wasn't baked into React itself. The APIs are super friendly too, and together they should make code splitting more approachable.

{{% h2 %}}`React.memo`{{%/ h2 %}}

According to [wikipedia](https://en.wikipedia.org/wiki/Memoization), **memoization** is an optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again.

My introduction to memoization happened with the Redux library [`reselect`](https://github.com/reduxjs/reselect). In `reselect` there is a `createSelector` function which optimizes expensive calculations that rely on inputs from a Redux store. If you're not familiar with memoization then I encourage you to take a look at the [Motivation for Memoized Selectors](https://github.com/reduxjs/reselect#motivation-for-memoized-selectors) section of the `reselect` docs. Consider it required reading. 📚

So what does this mean in the context of React? Up until this point, function components in React re-render _every time_ their parent renders, even if their prop values haven't changed. To solve this, React `v16.6` introduces a new higher-order component called `React.memo`. You use it the same way you would use any higher-order component in React, _except_ it is only to be used on function components.

```jsx
import React, { memo } from 'react'

const MemoizeMeCaptain = ({ prop1, prop2 }) => (
  <h1>Get it!</h1>
)

export default memo(MemoizeMeCaptain)
```

If `MemoizeMeCaptain` receives the same values for `prop1` and `prop2`, it will not re-render. This is a performance optimization and should be used in the same way you would use `React.PureComponent` for class components. You can even provide your own [comparison function](https://reactjs.org/docs/react-api.html#reactmemo) as the second argument to `React.memo` if you want more control.

Egghead.io has a great [free lesson](https://egghead.io/lessons/react-use-react-memo-with-a-function-component-to-get-purecomponent-behavior) on how to use `React.memo` by [Elijah Manor](https://twitter.com/elijahmanor). It's definitely worth a look! 👀

{{% h2 %}}`static contextType`{{%/ h2 %}}

The last new feature I want to touch on is `static contextType`, which is a new way of subscribing to context in class components. If you're not familiar with context in React, the [official docs](https://reactjs.org/docs/context.html#api) are a great introduction.

Consuming context in a component requires you to use a [render prop](https://reactjs.org/docs/render-props.html). I never really had a problem with this method, but I can definitely understand the argument that it creates unnecessary nesting and muddies up the component tree.

```jsx
render() {
  return (
    <MyContext.Provider>
      {context => (
        <h1>{context.value}</h1>
      )}
    </MyContext.Provider>
  )
}
```

In React `v16.6` the `static contextType` can be used on class components to consume context without requiring you to use render props at all!

```jsx
class App extends Component {
  static contextType = MyContext

  render() {
    return (
      <h1>{this.context.value}</h1>
    )
  }
}
```

`this.context` is also accessible in lifecycle methods, which is a major quality of life adjustment. Before, you'd have to jump through hoops to consume context in those methods. 

```jsx
class App extends Component {
  static contextType = MyContext

  componentDidMount() {
    console.log(this.context.value)
  }
  // ...
}
```

The only drawback I've found with this feature, and one that is mentioned in the [React docs](https://reactjs.org/docs/context.html#classcontexttype), is that you can only consume _a single_ context. That being said, there are [creative workarounds](https://reactjs.org/docs/context.html#consuming-multiple-contexts) for those who need it.

{{% h3 %}}A quick note on `static` properties{{%/ h3 %}}

I've touched on `static` properties in [a previous article](https://www.jakewiesler.com/blog/compound-component-basics/#code-static-code-properties). One important takeaway from that article, and one that still holds true, is that you can only use `static` properties in React class components if you're using [`@babel/plugin-proposal-class-properties`](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties). For you `create-react-app` users, this feature is [enabled by default](https://facebook.github.io/create-react-app/docs/supported-browsers-features#supported-language-features). 👍🏻

If you're not able to use `@babel/plugin-proposal-class-properties`, there is another way of declaring a `contextType` on a class:

```jsx
class App extends Component {
  render() {
    return (
      <h1>{this.context.value}</h1>
    )
  }
}
App.contextType = MyContext
```

{{< h2 >}}Final thoughts{{</ h2 >}}

`v16.6.0` of React is packed with some great features. I'm so excited for the future of this library. It's already a joy to use, but the core team continues to pump out great work to make our lives so much easier. And with everything announced at [ReactConf 2018](https://conf.reactjs.org/) last week, this is just the tip of the iceberg. 

It's a great time to be a developer working in the React ecosystem. Reach out to me on [Twitter](https://twitter.com/jakewies) and let me know what your favorite new features are!

