---
title: "React State Management With Unstated"
date: 2018-05-12T10:06:30-04:00
slug: "react-state-management-with-unstated"
description: "Unstated is a new react state management library from @jamiebuilds. It leverages the power of React's Context API to keep state management simple. This post will dive into how to get started with the library and why it's a good choice for most projects."
keywords: ['React', 'JavaScript', 'React State', 'unstated']
draft: false
stylesheet: "post.css"
---

_This post was originally published [here](https://www.zeolearn.com/magazine/react-state-management-with-unstated)._

The React community has seen a number of different state management patterns emerge over the last few years. They range from the very straight-forward `setState` API, to third-party libraries such as [Redux](https://github.com/reactjs/redux) and [MobX](https://github.com/mobxjs/mobx) (there are more, but these are the most widely used), and to the recently updated [Context API](https://reactjs.org/docs/context.html#when-to-use-context). 

[Unstated](https://github.com/jamiebuilds/unstated) is a fairly new library from [@jamiebuilds](https://jamie.build/) that's been gaining some momentum in the community. It leverages the power of React's Context API to make state management extremely simple. How simple? The tagline of `unstated` is:

> State so simple, it goes without saying.

After a few hours of working with it I realized just _how_ simple it is. The API is relatively small, and you can get up and running with it in a matter of minutes. This is a huge positive in a world where third-party state management solutions usually take considerable time to learn.

{{< h2 >}}State management primer{{</ h2 >}}

Before getting started, let's discuss why we're _really_ here in the first place. If you're reading this post then chances are you're either not happy with the existing solutions out there or you're looking to try something different. The former makes for much more interesting banter, so let's explore it. 

React ships with its own internal state management solution, `setState`. It's a straightforward API and a perfectly fine solution for most projects. Most, if not all React devs learn and use `setState` before anything else (as it should be). You will see many respected voices in the React community tell you not to use anything else until it's absolutely necessary. I would largely agree.

But, eventually you'll hit some pain points. In my experience, these pain points are usually in the form of large state objects and event handlers muddying up components, along with the annoying "prop drilling" pattern that inevitably emerges when passing state down to child components.

This led us to libraries such as Redux and MobX, which abstract state management away from the component level while still allowing components to "subscribe" to any given piece of state. This mostly solves the problems I mentioned above with `setState`, so why look any further? These libraries are hugely popular and well maintained. Wouldn't it make sense to double down on one of them and never look back?

> With great power comes great ~~responsibility~~ boilerplate.

I'm sure there's a larger discussion to be had about the pros and cons of these libraries, but I don't want to stray too far off our intended path here. I do, however, think it's important to mention the issue of boilerplate, because it's a real thing and something that has always frustrated me about Redux in particular.

The code is verbose. The amount of files (depending on project structure) you need to interact with just to make a change to a piece of state can be overwhelming. It's easy to start a new project with good intentions only to find yourself confused by your own folder structure because there is no standard.

This is what eventually led me to try `unstated`.

{{< h2 >}}Getting started{{</ h2 >}}

You can install `unstated` with yarn via `yarn add unstated`. From there, integrating it into your React application is a breeze. Like I mentioned before, the API is very small, exposing only 3 components:

```javascript
import { Provider, Subscribe, Container } from 'unstated' 
```

### `Provider`

The `Provider` is very similar to the other `Provider` types existing in libraries like Redux. You use it at the highest level of your application necessary to provide state to specific components:

```jsx
<Provider>
  <App />
</Provider>
```

### `Container`

The `Container` is used when creating a "slice" of state. You use it in a similar way you would use `React.Component`:

```javascript
class StateContainer extends Container {

  state = {}

  updateThis = () => { this.setState({}) }

  updateThat = () => { this.setState({}) }

}
```

`StateContainer` will hold a piece of application state, along with any methods that exist to update that state. It's a beautiful thing really, because everything is encapsulated together. 

Notice the use of `setState` here in the handler methods. According to the official [unstated docs](https://github.com/jamiebuilds/unstated#setstate):

> setState() in Container mimics React's setState() method as closely as possible.

This means that calling `setState` inside the `Container` will cause subscribed components to re-render! You can even use `setState` as a function:

```javascript
this.setState(prevState => ({}))
```

### `Subscribe`

Now that you know how to create state, how do you pass it to your components? This is where `Subscribe` comes in. It uses a [render prop](https://reactjs.org/docs/render-props.html) to pass state and methods into your components:

```jsx
<Subscribe to={[StateContainer]}>
  {container => (
    /* access container.state */
    /* access container.updateThis() */
    /* access container.updateThat() */
  )}
</Subscribe>
```

One interesting point to make about `Subscribe` is that the `to` prop takes an array. This gives you the ability to pass multiple state container instances into your components:

```jsx
<Subscribe to={[StateContainer, OtherStateContainer]}>
{(container, otherContainer) => /* */}
</Subscribe>
```

{{< h2 >}}An example{{</ h2 >}}

Now that we've gone over the entire API (yes, that's essentially the entire API in a nutshell), let's walk through an example together, shall we? I've gone ahead and created a sample project [here](https://github.com/jakewies/unstated-color-switcher). The project uses [create-react-app](https://github.com/facebook/create-react-app), [styled-components](https://www.styled-components.com/) 💅🏻 and [rcolor](https://github.com/sterlingwes/RandomColor) to generate new background colors out of random hexadecimal values.

### The container

Inside `src/containers/ColorContainer.js` you'll see encapsulated logic to manage the current state of colors:

```javascript
import { Container } from 'unstated'
import rcolor from 'rcolor'

class ColorContainer extends Container {
  state = {
    color: rcolor()
  }

  make = () => {
    this.setState({
      color: rcolor()
    })
  }

  active = () => this.state.color
}

export default ColorContainer
```

Everything inside of `ColorContainer` is only concerned with the state object. Nothing more, nothing less. Now, any component in the application can "subscribe" to this container, rendering based on the current state or updating that state based on user interaction.

### The subscriber

In `src/components/App.js` you'll find the application itself:

```jsx
import React from 'react'
import { Subscribe } from 'unstated'
import ColorContainer from '../containers/ColorContainer'
import { Outer, Inner, Button } from './styled'

const App = () => (
  <Subscribe to={[ColorContainer]}>
    {color => {
      const active = color.active()
      return (
        <Outer bg={active}>
          <Inner>
            <h1>{active}</h1>
            <Button onClick={color.make}>Another one!</Button>
          </Inner>
        </Outer>
      )
    }}
  </Subscribe>
)

export default App
```

When a user clicks on the rendered button, the `make` method updates the state of `ColorContainer` with a new hexadecimal value. This causes any subscribed components to re-render, in this case the `App` component. `App` will fetch the new value using the `active` method defined on `ColorContainer` and pass it to `Outer`, a styled component that styles its `background` property using the `bg` prop.

### The provider

And finally, `src/index.js` imports the `Provider` component from `unstated` and wraps the entire app inside of it, allowing any child components beneath to access container instances:

```jsx
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'unstated'
import App from './components/App'

render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

{{< h2 >}}Conclusion{{</ h2 >}}

In my opinion, the secret sauce behind `unstated` is how integrated it feels with React itself. It feels like this is how we were _meant_ to manage state in React. Not only that, but it's footprint is so small that you can sprinkle it in here or there. You don't need to think about structuring your application to fit this massive paradigm. 

I think `unstated` fits really well in the React ecosystem, sitting nicely between `setState` and other libraries like Redux and MobX. Consider giving it a try on your next project. You will find that it is a joy to use!

👾