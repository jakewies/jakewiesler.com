---
title: "Compound Components in React: The Basics"
date: 2018-08-10T10:27:00-04:00
slug: "compound-component-basics"
description: "Compound components are a fairly new technique that has become popular in the React community. In this post I will discuss what they are, why they are useful, and how to get started using them in your projects."
keywords: ["React", "Component", "Compound Components", "UI", "JavaScript"]
draft: false
stylesheet: "post.css"
---

At the end of 2017 [Kent C. Dodds](https://twitter.com/kentcdodds) released a fantastic set of videos called _Advanced React Component Patterns_ on [egghead.io](https://egghead.io/courses/advanced-react-component-patterns). In them he spent some time discussing an idea termed **compound components**.

I had gone into those videos with a focus on learning more about [render props](https://reactjs.org/docs/render-props.html) and [context](https://reactjs.org/docs/context.html), so it's funny to look back over a half-year later and realize that out of everything in the series (which I highly recommend), compound components have slowly progressed from being an overlooked technique to one of my favorite ways of composing UI.

## What are compound components

Take a second to look at the documentation for [semantic-ui-react](https://react.semantic-ui.com/), notably their [Form](https://react.semantic-ui.com/collections/form/) component. It shouldn't take long before you notice something _different_ about the way this component is being declared. 

```
import { Form } from 'semantic-ui-react'

const Usage = () => (
  <Form>
    <Form.Group>
      <Form.Input />
      <Form.Select />
      <Form.Button />
    </Form.Group>
  </Form>
)
```

`Form` is an example of a compound component. It is made up of a subset of other components that all work in tandem to produce some functionality. 

Note that I never imported `Form.Group` or `Form.Input`, etc., just the `Form` itself. This is an important observation and we will find out how this is possible later. 

I also want to point out that the object dot-notation-_esque_ syntax seen in the example above is not the de-facto way of writing compound components. In fact, this incredibly informative [talk](https://www.youtube.com/watch?v=hEGg-3pIHlE) given by [Ryan Florence](https://twitter.com/ryanflorence) on the topic never uses this syntax at all. 

It's not required, however in 2018 it is possible and therefore I opt for that route.

## What problems do they solve

There is a reason that I chose `semantic-ui-react` as an example of a library utilizing compound components. In fact, the majority of their components are authored using this technique.

> Why would they do that? There has to be a good reason, right?

There is, actually. You see, when you build a component library like `semantic-ui-react`, your end users are front end developers with a host of their own problems as well. Problems like ill-defined project requirements, constant design changes, poorly documented code. The list goes on. 

You don't want to be a part of that list. In fact, your goal _should_ be to alleviate some of the pain that stems from that list. Compound components are a step in that direction. 

They provide flexibility for the end user. They abstract away a lot of moving parts by managing state within themselves, state that the end user shouldn't need to worry about. If written properly, compound components could turn code written in a _fettuccine alfredo-like_ fashion into a box of well-designed legos.

## Getting started

Still reading? Cool. Let's write some code.

Normally I would create an example project on GitHub, but with the advent of [CodeSandbox](https://codesandbox.io/) that just seems silly now-a-days. If you're not familiar with CodeSandbox, are you alive friend? _Are you living?_ Jokes aside, it's a browser-based development environment with a host of other cool features. 

We're going to be building a simple chat application that manages a few different pieces of state such as the current message value and the entire list of messages sent. The goal is to have all of these pieces working together fluidly behind the scenes, while still providing flexibilty for the users of the component.

I've created the initial project structure using CodeSandbox's `creact-react-app` template [here](https://codesandbox.io/s/j7930yx04w). After you sign in you can fork the template to your own sandbox.

When you open up the template you should see a `/components` directory with three components:

- `Chat`
- `Input`
- `Messages`

These are the three components we will be working with. There's nothing too special going on right now. The `Chat` component is the _parent_, and it manages the state of the messages. The `Messages` component receives that state and renders them in a list, and the `Input` component can add a new message.

### Isn't this sufficient?

Sure, the code that currently exists is sufficient for most cases, but it's like a stiff piece of cardboard. There's no flexibility! What if you wanted to change the rendering order of `Chat`, maybe by moving the messages _below_ the input? What if you wanted to invert design control of each message over to the user? This is what compound components will give you.

In order to achieve this we'll need to discuss three things:

- `static` properties
- `React.Children.Map`
- `React.cloneElement`

The items above are what enable compound components using the dot-notation syntax that `semantic-ui-react` utilizes so heavily. We'll be using them to refactor the existing project. If you can understand these three things then you're on your way to crafting some truly awesome components.

## Static properties

The `static` keyword was introducted in ES6 as a way to define static methods on a javascript class. In order to use them you'll need to configure your project to support [Class Fields & Static Properties](https://github.com/tc39/proposal-class-fields), a Stage-3 TC39 proposal. Luckily, `create-react-app` [supports this _out-of-the-box_](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#supported-language-features-and-polyfills). Yay facebook, _amirite?_

_Note: If you are following along with another project that isn't bootstrapped with `create-react-app`, you can enable this feature via [babel-plugin-transform-class-properties](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/)._

### Adding static properties

Let's take the first step towards a more flexible `Chat` component by adding two `static` properties called `Messages` and `Input`, with their values equal to the corresponding components:

```
// src/components/Chat.js

import React, { Component } from 'react'
import Messages from './Messages'
import Input from './Input'

class Chat extends Component {
  static Messages = Messages
  static Input = Input

  // ...

}
```

I'm going to refer to these `static` properties as "sub-components" from this point forward. They will eventually enable us to invert layout control over to users of `Chat`. However, declaring them as `static` properties isn't enough. Currently they aren't doing anything. Why is that?

Take a look at the `Chat` component's render method: 

```
// src/components/Chat.js

class Chat extends Component {

  // ...

  render() {
    const { messages } = this.state;

    return (
      <div>
        <h1>Chatroom</h1>
        <Messages items={messages} />
        <Input onSubmit={this.add} />
      </div>
    )
  }
}
```

The layout is still hardcoded, going against our flexible philosophy. What we desire is to have the user of the component determine how things render. In order to do this, we first need to remove the `Messages` and `Input` components from the `render` method completely. Let's also remove the `messages` property from the state since we aren't using it at the moment:

```
// src/components/Chat.js

class Chat extends Component {

  // ...

  render() {
    return (
      <div>
        <h1>Chatroom</h1>
      </div>
    )
  }
}
```

We're no longer hardcoding `Messages` and `Input`, so users of `Chat` can explicitly declare them in their own code using the dot-notation syntax. Update the `App` component in `src/index.js` with the following:

```
// src/index.js

function App() {
  return (
    <div className="App">
      <Chat>
        <Chat.Messages />
        <Chat.Input />
      </Chat>
    </div>
  );
}

```

Things are slowly starting to take shape, but now the app is broken. All that's rendering is `<h1>Chatroom</h1>`. At first glance, you might think the solution would be to render `this.props.children` underneath it:

```
// src/components/Chat.js

class Chat extends Component {

  // ...

  render() {
    const { children } = this.props

    return (
      <div>
        <h1>Chatroom</h1>
        {children}
      </div>
    )
  }
}
```

However, now we get an error. The error stems from the fact that `Chat.Messages` is not getting an `items` prop the way it did when we were hardcoding the `render` method. This would also mean that `Chat.Input` isn't getting its `onSubmit` prop either. 

We can't put the onus on the user to pass those props around. They don't even have access to them. They're tucked away in a black box. So now the question becomes, _how do we keep this flexible component syntax while also passing data?_ 

This is where the next two items on our list of things to discuss, `React.Children.map` and `React.cloneElement`, come in to play.

## `React.Children.map`

According to the [React docs](https://reactjs.org/docs/react-api.html#reactchildren), `React.Children` is a top-level API that "provides utilities" for dealing with `this.props.children`. One of those utilities is `React.Children.map`. It behaves similarly to the native `Array.map` method in JavaScript. It iterates through a component's _direct_ children, allowing you to manipulate each child in any way you see fit:

```
React.Children.map(this.props.children, child => {
  /* do stuff */
})
```

Why is this important to us? We can use the utility to access any direct children of the `Chat` component, in this case `Chat.Messages` and `Chat.Input`. Let's update the render method of `Chat`, using `React.Children.map` to return each child:

```
// src/components/Chat.js

// ...

render() {
    const { children } = this.props;
    return (
      <div>
        <h1>Chatroom</h1>
        {React.Children.map(children, child => {
          return child;
        })}
      </div>
    );
  }
```

After you save, you'll notice that the error is still there. That's because we're still not passing any props to the children. The code above is the same as rendering `this.props.children` like we did before. The final output would end up looking like this:

```
  <div>
    <h1>Chatroom</h1>
    <Chat.Messages />
    <Chat.Input />
  </div>
```

See? Still no props being passed. Luckily, React gives us another utility to make this happen.

## `React.cloneElement`

The last item to discuss is `React.cloneElement`, another method offered by the React API. According to the [docs](https://reactjs.org/docs/react-api.html#cloneelement), `React.cloneElement` will:

> "Clone and return a **new** React element using `element` as the starting point."

That's useful. Not only do we have the ability to map over `this.props.children`, but we also have the ability to _transform_ those children. The next line in the docs provides more insight into how this is done:

> "The resulting element will have the original element’s props with the **new props** merged in shallowly. New children will replace existing children."

So, `React.cloneElement` provides a transformation window in which you can replace an existing element with a copy of itself. This copy, or _clone_, can accept additional props you explicitly define during the cloning process. 

It's important to note that React performs a "shallow merge" with these additional props and any props that existed on the element before it was cloned. Therefore, if the cloned element previously had a prop named `foo`, and you decide to add an additional prop _also_ named `foo` during the cloning process, your prop will overwrite the old one.

With this information, along with `React.Children.map`, we have everything we need to access the sub-components of `Chat` and pass them the data they need. However, in order to do this _you_ need a mechanism for identifying specific children. This is important, else you wouldn't be able to pass the right prop to the right child.

Furthermore, it's not enough to just clone each child _willy-nilly_, because there will undoubtedly be children that should be left alone. You have to think about these use cases when building compound components that will be used by other developers.

### Identifying children

There are a few ways to do this, and they're all relatively similar. I'll show you the way that my team and I identify specific children as it has worked well for us. We use a property on React components called `displayName`. The `displayName` property, according to the [docs](https://reactjs.org/docs/react-component.html#displayname), is primarily used for debugging purposes, however I find it useful here. 

You can explicitly add a `displayName` to any component, class or functional. It's the same as adding `propTypes` or `defaultProps`. Let's add a `displayName` to both the `Messages` and `Input` components:

```
// src/components/Messages.js

const Messages = ({ items }) => (
  
  // ...

)

Messages.displayName = "Messages"
```

```
// src/components/Input.js

class Input extends Component {
  static displayName = "Input"

  // ...

}
```

Now we can use this property as our mechanism for identifying specific children. In `Chat.js` we're currently mapping through `this.props.children` and returning each. Before returning the child, try logging its `displayName` to the console.

```
// src/components/Chat.js

// ...

{React.Children.map(children, child => {
  console.log(child.type.displayName)
  return child;
})}
```

If you open the console you should see `"Messages"` and `"Input"` have been logged! Awesome, now that we can distinguish between children, let's use `React.cloneElement` to pass the right props to the right children:

```
// src/components/Chat.js

// ...

render() {
  const { messages } = this.state
  const { children } = this.props

  return (
    <div>
      <h1>Chatroom</h1>
      {React.Children.map(children, child => {
        if (child.type.displayName === 'Messages') {
          return React.cloneElement(child, {
            items: messages
          })
        }

        if (child.type.displayName === 'Input') {
          return React.cloneElement(child, {
            onSubmit: this.add
          })
        }

        return child
      })}
    </div>
  )
}
```

Now the error messages should disappear and everything should be working like normal! You just wrote your first compound component, albeit a pretty basic one. It's definitely more flexible and user-friendly than before, but not by much. 

To showcase this, you can try a few things:

- Re-arrange the render order of the sub-components in `src/index.js`. You should be able to move `Chat.Input` above `Chat.Messages` and everything will still work correctly. 
- Add another element inside of `Chat`, like an `<h2>Hello World</h2>`

## Drawbacks

We now have a group of components that manage themselves internally and allow the user to manipulate their layout order. This is nice, however there are a few "holes" in our component's design. 

What would happen if you wanted to wrap any of the sub-components in another component, or even a simple `div`? This seems like a logical choice a developer would make. Give it a shot. Wrap `Chat.Input` in a `div`. What happens?

The component still renders, however if you try to submit something you'll get an error: 

```
`onSubmit` is not a function. 
```

But why? We cloned `Chat.Input` and passed it the `onSubmit` prop, did we not? 

No, in this scenario we didn't, because `Chat.Input` is no longer a _direct_ child of `Chat`. That seat is now held by the innocent looking `div`. This is where the limitations of `React.Children.map` begin to show. If you _really_ want to craft a flexible compound component, you'll have to take things a step further (more below).

## Conclusion

Let's take a step back and review:

- We learned about `static` properties and how they allow us to use the dot-notation syntax with sub-components. 
- We learned about certain utilities the React API provides like `React.Children.map` and `React.cloneElement`. 
- We learned how to identify specific children using the `displayName` property. 

And we used all of this information to craft a flexible compound component that manages its own state and inverts layout control to the user.

In the next post of this series we will address the drawbacks of `React.Children.map` by refactoring `Chat` to use the [Context API](https://reactjs.org/docs/context.html), giving us the ability to pass data to any child, no matter their level in the component tree. 









