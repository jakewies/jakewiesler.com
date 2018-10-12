---
title: "Compound Components in React: Using the Context API"
date: 2018-10-10T19:50:06-04:00
slug: ""
description: "In the first post of this series we discussed the basics of compound components in React. They are a group of components that work in tandem to produce some functionality. Unfortunately, there are some constraints when authoring components in this way. In this post we'll combine the flexibilty of compound components with the powerful React Context Api."
keywords: ["React", "Component", "Compound Components", "Context", "JavaScript"]
draft: false
stylesheet: "post.css"
---

> This post is meant to guide the reader through a working example on [CodeSandbox](https://codesandbox.io/s/zz95n04wx4). I recommend following along on a desktop. 👾

In the [first post](https://www.jakewiesler.com/blog/compound-component-basics/) of this series I introduced **compound components**, a group of components that work in tandem to produce some common functionality. We discussed how to:

- add "sub-components" to a parent using the `static` keyword
- loop through the _direct_ children of a component using `React.Children.map`
- identify specific children using the `displayName` property
- edit children by passing them additional props using `React.cloneElement`

These techniques give us a unique ability to abstract away irrelevant implementation details, resulting in a clean API for the end user.

## Revisiting drawbacks

Even though we accomplished what we set out to do in that first post, our solution was quite fickle. Here are a few inconvenient truths posed as questions that you may or may not have asked yourself while following along.

> "We have to use this strange `displayName` property to identify a component?"

> "We can only access direct children inside `React.Children.map`?"

> "I have to clone the component I want to pass data to? That doesn't sound good for performance."

In my opinion, the biggest drawback surrounds `React.Children.map`. Not only is it a pain to write this code in your component's `render` method, but it also has the limitation of **only** giving you access to the _direct_ children of the component you're rendering.

```
{React.Children.map(this.props.children, child => {
  /* only direct children */

  /* if statements everywhere! */
  if (child.type.displayName === 'Thing') {}

  if (child.type.displayName === 'OtherThing') {}
})}
```

Ideally I don't want to rely on this long term. An alternative solution would need to handle the following use cases:

1. Children are accessible at _all_ levels of the component tree
2. A child should be able to explicitly _subscribe_ to a piece of state
3. A cloning process _should not_ be required to pass data down to children

> Does such a solution exist?

## React's Context API

Enter the [Context API](https://reactjs.org/docs/context.html), a new addition to the React library in version 16.3. The API allows a component to pass data down to any of its children, whether they be direct or indirect. The official React docs give a great description of what Context is meant for:

> Context is designed to share data that can be considered “global” for a tree of React components

If you aren't familiar with the Context API, there are a slew of great tutorials on the Interwebs. The [offical docs](https://reactjs.org/docs/context.html#api) are, in my opinion, the most helpful. I recommend pausing here and brushing up on the concept before moving forward.

## Getting Started

I've created a [starter template](https://codesandbox.io/s/zz95n04wx4) on CodeSandbox. It starts exactly where we left off in the [last post](https://www.jakewiesler.com/blog/compound-component-basics/), with a working implementation of a basic compound component named `Chat`. If you haven't read that post it may be helpful to do so in order to gain some _context_ 😂😂. 

### What we have so far

You'll notice in `src/index.js` that the `Chat` component is being rendered with three children components. They are sub-components declared via the dot notation-like syntax:

```
// src/index.js

<Chat>
  <Chat.Messages />
  <Chat.Input />
  <Chat.Button />
</Chat>
```

This file is an example of how our users will utilize the `Chat` component in real life. Because of the nature of this example, these components don't come with a slew of options that can be passed as props. So the surface API is practically non-existent. However, it should be obvious to anyone reading the code what is happening here. 


## Creating `Context`

To start, open up `src/components/Chat.js` and edit the file so that you are importing the `createContext` method from the `react` library. Call the method near the top of the file and set the result equal to a new variable named `ChatContext`.

```
// src/components/Chat.js

import React, { Component, createContext } from 'react'

...

const ChatContext = createContext()
```

The `createContext` method returns an object containing a `Provider` and `Consumer` pair. The former exposes data to the latter. 

We'll convert `Chat` to render the `Provider` in order to faciliate the exposure of its state to any underlying `Consumer`s. This also means we can remove the unsightly `React.Children.map` method:

```
// src/components/Chat.js

...

render() {
  const { children } = this.props

  return (
    <ChatContext.Provider>
      <h1>Chatroom</h1>
      {children}
    </ChatContext.Provider>
  )
}
```

This change will cause the app to error. Don't sweat it, as it will be resolved during the refactor.

## Providing `Context`

We need to satisfy the only prop that `ChatContext.Provider` requires. It is called `value`. This prop can be thought of simply as the _actual context_ being provided. 

If you take a look at all of the props that the sub-components of `Chat` require in order to function properly, you'll quickly notice that some are not pieces of state, but rather functions that manipulate state. This is one of the fundamental concepts of the Context API.

> Not only can you pass pieces of state via Context, but you can also pass functions that "act" on the state.

Because of this, we'll need to combine the values defined on `Chat`s state object along with its class methods into a single object that will be used as the `value` prop for `ChatContext.Provider`. We can do this in one of two ways.

The first way is to simply create a new object, we'll call it `context`, at the top of the `render` method with all the necessary data inside of it. Then we can pass that object to `ChatContext.Provider`:

```
// src/components/Chat.js

...

render() {
  const { children } = this.props;
  const { messages, currentMessage } = this.state;
  const { updateCurrentMessage, add } = this;
  const context = { 
    messages, 
    currentMessage, 
    updateCurrentMessage, 
    add 
  }

  return (
    <ChatContext.Provider value={context}>
      <h1>Chatroom</h1>
      {children}
    </ChatContext.Provider>
  )
}
```

Although this works, there is a significant downside. The `context` object must be re-created every time the `Chat` component renders, even if none of the values inside of the object have changed. This will inevitably cause some unnecessary re-rendering of the components below.

The second and more performant way to handle this would be to _add_ the methods to the `state` object of `Chat`, and pass the `state` directly to `ChatContext.Provider`:

```
// src/components/Chat.js

class Chat extends Component {
  ...

  updateCurrentMessage = event => {/* */};

  add = () => {/* */};

  state = {
    currentMessage: "",
    messages: [],
    updateCurrentMessage: this.updateCurrentMessage,
    add: this.add
  };

  render() {
    const { children } = this.props
    
    <ChatContext.Provider value={this.state}>
      {children}
    </ChatContext.Provider>
  }
}
```

This way the underlying sub-components won't suffer from unnecessary re-renders.

## Consuming `Context`

The last step in this refactor is to update the sub-components of `Chat` so that they consume the context created earlier instead of relying on props. In order for this to happen we'll need to export `ChatContext.Consumer` out of `Chat.js`.

```
// src/components/Chat.js

...

export const ChatConsumer = ChatContext.Consumer
```

In each sub-component you can now import `ChatConsumer` and render it as the root element of each.

```
// src/components/Messages.js

import React from 'react'
import { ChatConsumer } from './Chat'

const Messages = () => (
  <ChatConsumer>
    {({ messages }) => (/* render Messages */)}
  </ChatConsumer>
)

```

```
// src/components/Input.js

import React from 'react'
import { ChatConsumer } from './Chat'

const Input = () => (
  <ChatConsumer>
    {({ currentMessage, updateCurrentMessage }) => (/* render Input */)}
  </ChatConsumer>
)

```

```
// src/components/Button.js

import React from 'react'
import { ChatConsumer } from './Chat'

const Button = () => (
  <ChatConsumer>
    {({ add }) => (/* render Button */)}
  </ChatConsumer>
)

```

Before this refactor, the sub-components of `Chat` relied on props passed in during the `React.cloneElement` process. Now, instead of mapping through each child and cloning them, we're explicitly declaring what data we need from the `Provider`. This data is a drop-in replacement for the props that were being used before, albeit with a few name changes.

For instance, `Button` used to expect an `onClick` prop, which was a reference to the `add` method on the `Chat` component. Now it gets direct access to `add` via Context:

```
// Before

const Button = ({ onClick }) => (
  <button onClick={onClick}>Send</button>
)


// After

const Button = () = (
  <ChatConsumer>
    {({ add }) => (
      <button onClick={add}>Send</button>
    )}
  </ChatConsumer>
)
```

The `Input` component also has a few name changes you'll need to address. Originally it expected a `value` and an `onChange` prop. These were just mappings to `this.state.currentMessage` and the `updateCurrentMessage` method on the `Chat` component respectively:

```
// Before

const Input = ({ value, onChange }) => (
  <input type="text" value={value} onChange={onChange} />
);


// After

const Input = () => (
  <ChatConsumer>
    {({ currentMessage, updateCurrentMessage }) => (
      <input
        type="text"
        value={currentMessage}
        onChange={updateCurrentMessage}
      />
    )}
  </ChatConsumer>
);
```

With these changes all errors should be resolved and the application should be working properly as before!

### A note on render props

The `Consumer` returned by the `createContext` method uses a [render prop](https://reactjs.org/docs/render-props.html). This is why we are able to access the context object from the `Provider` through inversion of control. Familiarity with the render prop pattern will definitely be of use here.

## The story so far

That wasn't too much work. I've definitely had tougher refactors. But, was it worth it? It really depends on your use case. In my opinion, constructing compound components with this strategy is almost always worth it. Especially if you do it this way the first time around. 

Let's hop into `src/index.js` and see what happen when we apply the same test as the previous post, wrapping `Chat.Button` in a `div` element.

```
// src/index.js

<Chat>
  <Chat.Messages />
  <Chat.Input />
  <div>
    <Chat.Button />
  </div>
</Chat>
```

Last time we did this `Chat.Button` stopped working due to the fact that it wasn't receiving its `onClick` prop, an operation that was occuring during that harmless cloning process. In this case, however, our app still works! 

Context has solved our number one problem: passing information to children no matter where they're at in the component tree. You can nest that button in a hundred `div`s and the sucker will still work. 

This provides loads of flexiblity to our end users. We've only placed a single constraint on them, which is that all sub-components of `Chat` _must_ be rendered beneath it. A pretty fair tradeoff I'd say.

Which leads me to my final point of this post. What were to happen if you decided **not** to render a sub-component, say `Chat.Button`, underneath its parent `Chat`?

```
// Here there be errors, arrrgh!

const App = () => (
  <div>
    <Chat>
      <Chat.Messages />
      <Chat.Input />
    </Chat>
    <Chat.Button />
  </div>
)
```

Yes, an ugly little error! This is a use case we haven't planned for, and the chances of this happening in the wild are quite high, especially if you're working with open source software. In the next post I'll discuss how we can warn users of `Chat` about such consequences! 




