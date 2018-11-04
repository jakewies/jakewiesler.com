---
title: "A Primer on React Hooks"
date: 2018-11-07T07:57:00-05:00
slug: ""
description: "React hooks are functions that expose certain features previously unavailable to functional components such as state and lifecycle. They were announced at ReactConf 2018 and are an experimental proposal as of writing this. React hooks are slated to become official in the v16.7.0 release. Here's what you should know right now."
keywords: ["React", "React hooks", "JavaScript"]
draft: true
tags: ["React"]
stylesheet: "post.css"
---

On the afternoon of October 25th I hastily shuffled my work to the side and fired up YouTube, knowing that the ReactConf 2018 keynote was minutes away from starting. This would be the first conference keynote I watch live, and I wanted no interruptions. As the next two hours began to unfold I realized I was witnessing a significant moment for React. An evolution of the library. 

Coming off the heels of a strong `v16.6.0` release, the React core team announced [hooks](https://reactjs.org/docs/hooks-intro.html), a feature proposal that exposes certain capabilities to functional components such as state and lifecycle. These capabilities were previously limited to class components. 

You can watch the entire keynote along with a follow up talk from [Ryan Florence](https://twitter.com/ryanflorence) in this [YouTube video](https://www.youtube.com/watch?v=dpw9EHDh2bM). If you have 90 minutes to kill I encourage you to watch. 👀

Still here?

{{< gif src="https://media.giphy.com/media/1034EEGrn91SrS/giphy.gif" caption="Cool beans, man." >}}

Before we begin I must tell you that this is an **experimental proposal**. Nothing you see here should be considered final. There is currently an [open RFC](https://github.com/reactjs/rfcs/pull/68) where you can stay current on the proposal, and even voice your concerns if you have any.

{{% h2 %}}What are hooks?{{%/ h2 %}}

As I stated earlier, **React hooks** are a way for functional components to access certain features previously unavailable to them. The obvious ones being state and lifecycle. Here's another definition from the [React docs](https://reactjs.org/docs/hooks-overview.html#but-what-is-a-hook):

> Hooks are functions that let you “hook into” React state and lifecycle features from function components.

This is a major change, both technical and conceptual. However, hooks come with no breaking changes. They're backwards compatible and opt-in, meaning you as a developer don't need to use them at all. If that's your prerogative. It's an impressive selling point.

{{% h2 %}}What problems do they solve?{{%/ h2 %}}

The [Motivation](https://reactjs.org/docs/hooks-intro.html#motivation) section of the official docs details specific problems that the React core team believes hooks solve, so I won't regurgitate those here. However, I do want to add my own point of view.

### Moving away from classes

I've had a strange relationship with classes in JavaScript. Sort of like a monster in my closet that I refuse to acknowledge. JS is my first programming language, and I definitely haven't worked with another that has classes in the traditional sense. 

I've heard that classes in JS are *different* than classes in other languages. This leaves an empty spot in my brain, as if I need to go figure out what those differences are. I still haven't.

I've heard that you should stay away from classes in JS. In fact, I heard this before I started working with React at all, so you can imagine my confusion when coming to the library and realizing that classes were fundamental. 

The introduction of hooks is an indicator that the core team sees value in functional components over the long term, and there are [clear reasons](https://reactjs.org/docs/hooks-intro.html#classes-confuse-both-people-and-machines) to prefer them over class components. That being said, I don't think we will see classes phased out any time soon, if ever. This would go against the backwards compatible mindset. Imagine all of the code that would be affected by such a change!

### More functional components

The longer I do this whole programming thing the more I discover about myself. One of those discoveries is that I *love* writing functions. It doesn't matter the language. 

I once read (and didn't finish) an oft-cited book in the realm of programming called [Structure and Interpretation of Computer Programs](http://web.mit.edu/alexmv/6.037/sicp.pdf). It comes with a slew of example code that you can work through in [Scheme](https://en.wikipedia.org/wiki/Scheme_(programming_language)), a dialect of the Lisp programming language. It was my first *real* introduction to the functional programming paradigm, and man was it cool. I loved it. I should finish that book someday.

Anyway, sorry for the tangent. Where were we? Ah yes, *functions*. Building user interfaces with functions as my building blocks seems to make a whole lot of sense. The composibility is there. The developer experience just feels right. I lose that feeling when I'm trying to read some 100+ line class in my codebase.

And what's even better is that hooks are functions *too*! The [official docs](https://reactjs.org/docs/hooks-intro.html#its-hard-to-reuse-stateful-logic-between-components) state that reusing stateful logic is one of the motiviations of hooks. It's going to be such a powerful pattern. I'm imagining all of those providers, all of those render props and all of those higher-order components slowly washing away. What a beautiful thought.

{{% h2 %}}Getting started with hooks{{%/ h2 %}}

You can get started with hooks using React `v16.7.0-alpha`, but I've set up a [CodeSandbox](https://codesandbox.io/s/1z16jj9y24) that will get you started quickly if you want to follow along with the rest of this post. Ok, enough with the chitter-chatter. Let's write some code.

Let's take a look at some of the [built-in hooks](https://reactjs.org/docs/hooks-reference.html) the come with React.

{{% h3 %}}`useState`{{%/ h3 %}}

{{% h3 %}}`useEffect`{{%/ h3 %}}

{{% h3 %}}`useContext`{{%/ h3 %}}

{{% h3 %}}Writing a custom hook{{%/ h3 %}}
