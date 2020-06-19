---
title: 'Using styled-components Without Template Literals'
date: '2018-03-01'
description:
  "I've noticed a pattern emerge from a few different libraries that use
  styled-components internally when declaring a component using the styled API.
  What's interesting about this pattern is I haven't seen it documented much and
  nobody has shed light on it. In this post I will explain what it is, how it
  works, and why it's useful."
tags: ['React']
---

Normally, if you’ve used `styled-components` in the past, you’ve probably seen
the default (according to the documentation) way of declaring a component using
the `styled` API:

```javascript
import styled from 'styled-components'

const Button = styled.button`
  background: palevioletred;
  color: #fff;
`
```

Nothing shocking here. The documentation uses this pattern and if you view any
material on `styled-components` you’ve probably seen the exact same thing.

Well, in the past few weeks I’ve seen a different pattern in a few libraries
utilizing `styled-components`, but I haven't seen much information about it.
Here it is:

```javascript
const Button = styled('button')([], 'background: palevioletred', 'color: #fff')
```

This is interesting and I'd like to explore it.

## Tagged template literals

If you read Max Stoiber’s post
[The magic behind styled-components](https://mxstbr.blog/2016/11/styled-components-magic-explained/),
he goes into some detail about the inner workings of his popular CSS library.
The `styled` API of `styled-components` relies on tagged template literals, and
this is probably the way you will see most people using it.

But, it's not the only way to declare components using the `styled` API. This is
the key idea behind this post, yet it may seem unclear right now. So, to answer
the question, _how does it work?_, we first need to dive a bit further into
tagged template literals.

Let’s make an important distinction regarding template literals vs tagged
template literals. _What is the difference?_

**Template literals** are, according to Mozilla:

> "string literals allowing embedded expressions."

These strings can be multi-line:

```javascript
const multiLiner = `
  Look Ma,
  2 lines!
`
```

And they can also contain embedded expressions, which is another way of saying
they support _interpolations_:

```javascript
const food = 'burger'

const str = `Mmmmm! that is a tasty ${food}!`
```

`${ This here }` is an interpolation. Think of them as placeholders for
JavaScript expressions.

**Tagged template literals**, on the other hand, are simply template literals
that are used to call a function instead of the normal comma-separated values
inside of parentheses:

```javascript
// regular function call

myFunc(1, 2, 3)

// tag function call

myFunc`1, 2, 3`
```

The second version of `myFunc` above is known as a **tag function**.

The way the two call sites of `myFunc` pass on their parameters is what sets
them apart. You already know how a regular function call passes on its
parameters, but I don’t expect you to know how tag functions do so.

Max
[sums this up](https://mxstbr.blog/2016/11/styled-components-magic-explained/)
extremely well in his post, and it’s _the_ thing you must understand about
tagged template literals, so I will summarize how it works by using the same
function he created:

```javascript
const logArgs = (...args) => console.log(...args)
```

The function above uses the _spread…rest_ operators. The arguments to the
function are being collected into a single array named `args` using the `…args`
syntax. This is referred to as **rest**. You can think of it as “collecting the
rest” of the arguments into an array named `args`. It’s useful when you don’t
know how many arguments the function might have.

It’s sibling, **spread**, occurs when we log the arguments to the console using
`console.log(...args)`. We’re literally “spreading out” the contents of the
`args` array.

These two operators help us visualize exactly what’s being passed to `logArgs`.
Let’s examine the result of this function when called in the two ways described
earlier:

```javascript
logArgs(1, 2, 3)

// -> 1

// -> 2

// -> 3

logArgs`1, 2, 3`

// -> ["1, 2, 3"]
```

Calling the function as normal does what we expect. It spreads the `args` array
out into individual values, and logs each to the console.

Calling `logArgs` using a tagged template literal, on the other hand, logs an
array. This is our first lesson:

> Tagged template literals pass an array of string values as the first argument
> to the tag function.

Things get even more interesting when we include interpolations:

```javascript
const food = 'burger'

logArgs`Mmmm! That is a tasty ${food}!`

// -> ["Mmmm!  That is a tasty ", "!"]

// -> "burger"
```

`logArgs` still outputs an array of string values as its first argument, but if
the tagged template literal has an interpolation then the expression inside the
interpolation is passed as the next argument.

What happens when there are multiple interpolations?

```javascript
const food = 'burger'
const adj = 'tasty'

logArgs`Mmmm! That is a ${adj} ${food}!`

// -> ["Mmmm!  That is a ", " ", "!"]

// -> "tasty"

// -> "burger"
```

We could have as many interpolations as we want, and each one will be passed
accordingly. This is the second lesson:

> If interpolations exist inside tagged template literals, their containing
> expressions are passed as additional arguments to the tag function.

Let's see how tagged template literals handle interpolated functions:

```javascript
logArgs`Mmmm! That is a tasty ${() => 'burger'}`

// -> ["Mmmm!  That is a tasty", "!"]

// -> () => "burger"
```

The function itself is being included as an argument. This is the essence of
`styled-components`. By capturing such a function, the library can execute it
and do what it needs to do, mainly merge the resulting value back in to the
string values inside the array.

## Tying our new-found knowledge together

Now that we know how tagged template literals work, let's gain a deeper
understanding of the `styled` API:

```javascript
const Button = styled.button`
  background: ${props => (props.primary ? 'red' : 'white')};
  color: black;
`
```

`styled.button` is a tag function. If we were to log the arguments of this
function, we'd see this:

```javascript
logArgs`
  background: ${props => (props.primary ? 'red' : 'white')};
  color: black;
`

// -> ["background: ", "; color: black;"]
// -> props => props.primary ? "red" : "white"
```

Are you seeing the power here? It's no wonder why `styled-components` has become
so popular as a CSS-in-JS solution. Not only do tagged template literals allow
us to write multi-line CSS naturally, but it allows the library to manipulate
styles through these interpolated functions, giving our components a dynamic
feel.

## How does the other pattern work?

Ah, yes. That's why you're here isn't it. Earlier I showed another way of using
the `styled` API that I've been seeing lately:

```javascript
const Button = styled('button')([], 'background: palevioletred', 'color: #fff')
```

First, understand that `styled.button` and `styled('button')` are treated the
same way. They're interchangeable.

Second, there's no tagged template literal action here. But, since we know that
`styled` supports them, _we know how it expects its arguments_. This is the
major 🔑.

Remember the two rules:

1. Tagged template literals pass an array of string values as the first argument
   to the tag function.
2. If interpolations exist inside tagged template literals, their containing
   expressions are passed as additional arguments to the tag function.

So the tag function expects an array of string values as its first argument, and
interpolated expressions follow suit.

In the pattern above, which I will give the name _"The Empty Array Pattern"_,
the arguments are:

```javascript
// -> []
// -> 'background: palevioletred'
// -> 'color: #fff'
```

The first argument is an array, and satisfies rule number one. Yes, there's no
string values inside the array, but that's totally fine. The additional
arguments are strings which, by definition are expressions that produce a value,
and as such they satisfy rule number two.

> We've mimicked the behavior of tagged template literals without actually using
> them.

## Wrapping up

At the end of the day, both patterns produce the same value. What I'm finding
difficult to discover is why you would want to use one over the other. I guess I
could see a situation where, using tagged template literals, you had multiple
interpolations, and for code readability you could choose the Empty Array
Pattern instead:

```javascript
// as tagged template literal

const Button = styled.button`
  background: ${props => props.background};
  color: ${props => props.color};
`

// as Empty Array Pattern

const Button = styed.button([], props => ({
  background: props.background,
  color: props.color,
}))
```

I'd love to hear insights from others who have experience with these patterns,
and what the pros and cons are of each. Reach out to me on
[Twitter](https://twitter.com/jakewies) so we can discuss!
