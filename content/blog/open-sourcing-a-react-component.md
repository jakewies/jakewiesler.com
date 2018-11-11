---
title: "Lessons Learned From Publishing a React Component to npm"
date: 2018-02-26T15:01:28-05:00
slug: "lessons-learned-from-publishing-a-react-component-to-npm"
description: "I've been working on my true open source project, one that is ready for use in production. It's a grid system built with React components based on flexbox. Here's what I've learned."
keywords: ["React", "npm", "Component", "Open Source", "JavaScript"]
tags: ["React", "Open source"]
draft: false
stylesheet: "post.css"
---

A few weeks ago I ran into a situation while working on a React project where I wanted to have a grid system. One that was very similar to bootstrap. I knew that there were various options already built, but I thought this would be a great moment to create my own and release it as my first open source library.

Creating a library and publishing it to `npm` has been, up until this point, an almost elusive task for me. I've never done it, I hadn't the slightest clue where to start, and quite frankly I was a bit intimidated at the idea of releasing my own code for others to use in production. That being said, I knew that the knowledge I'd come away with after accomplishing this goal would be extremely useful to my career and continued journey through the JavaScript ecosystem.

So, after a few weeks of writing code, googling, and hitting roadblocks along the way, I finally shipped v1.0.0 of [flexomatic](https://github.com/jakewies/flexomatic), a grid system built with `styled-components` and based on the methodology presented in [Solved By Flexbox](https://philipwalton.github.io/solved-by-flexbox/demos/grids/). Here are a few things I took away from the experience.

## Think about the API before writing the code

There is one thing I wish I would have done before I wrote a single line of code, and that would be to take a pencil and some paper and write out how I, a potential user of the library, would like the API to look. 

Skipping this is totally ok. I did it, and at the end of the day I still shipped code. But in doing so I spent a lot of wasted time going back and forth on changes to the API design during the development process. Maybe that works for you, but for me it felt frustrating at times. 

React components can come with a lot of built-in functionality that, at the end of the day, is just an implementation detail to the user. They are abstractions. But there are some things that must be exposed. Ask yourself these questions:

- What props will my component accept? 
- What structure will these props have?
- How will I name these props?
- Will my component need to hold on to any state? 

In my opinion, the more flexible the React component the more useful it becomes. Of course this comes with some tradeoffs. Flexibility in a React component is great, but too flexible and your component becomes prone to bugs and unintended use cases. These can be avoided with documentation and tests, which we'll discuss later on.

## Use `npm link` to see your components in action

This is, without a doubt, the most useful and practical lesson you can take away from this post. If you've never created a project with the intent to open source it, then you probably haven't come across the `npm link` command. So, what does it do?

`npm link` allows you to develop a component/package/module/etc. in its own project, and simultaneously test it in another project on your computer. At first I didn't really understand the true value in this, but when you put it in action it's brilliant.

Accomplishing this is a straightforward two-step process. Imagine you are working on a potential open source creation called `react-thingamuhjigger`. At the root of this project type `npm link`. This will create a symlink in a globally accessible `node_modules` folder that's within reach of other projects on your computer. Next, in another project, type `npm link react-thingamuhjigger`. This will allow you to use the React component(s) you're working on as if you had installed it from the `npm` registry. 

I spun up a quick test project using `create-react-app` in order to test my components without needing to worry about any configuration, but you could easily link inside any existing React projects just as well. What's so powerful about this is that you can develop your React components and see them update in your test project on the fly. 

## Use `jest` snapshots to test your components

I want to preface this section by saying I'm very new to testing JavaScript applications. In fact, `jest` is the first and only testing platform I've used. So why would I recommend it here? `jest` has an incredibly useful feature known as **snapshot testing**. The basic idea is that `jest` will take a "snapshot" of your React component at the time your tests run, and it will compare this snapshot to the last one taken. The test will fail if the two snapshots don't match.

This is useful to catch any unintended UI changes to a specific component. Of course, if the change was intended, `jest` gives you a way to update your snapshots. It's a really useful tool and I highly recommend messing around with it.

## Document your components early and often

I found that writing documentation in tandem with building the components ended up being really useful. This seems counter-intuitive at first, but opting to document component usage during the development phase rather than pushing it to the end of the project was easier because everything was so fresh in my mind. 

Whenever I finished a feature or added the ability to handle some new use case, I would immediately document it in my project's `README`. This created a symbiotic relationship between writing the documentation and the actual code. I found that doing so allowed me to identify any "holes" in the way my components work.

I understand that this may contradict the first point I made in this post about designing the API before writing any code, but it's worth mentioning. I did find value here.

## Learn from others by exploring their projects

I spent _a lot_ of time snooping through other projects similar to mine, trying to gauge how others handled configuration. 

> Configuration is the bane of my existence.

Seriously. I'm sure you can agree. Sometimes trying to setup a JavaScript project can be a pain in the ass. During a project's development cycle, I probably spend 10% of my time writing actual code. The rest is spent googling and configuring. 

Setting up a project that will eventually be open sourced is even more of a pain for newcomers. There is a lot I didn't know about before starting. Luckily, GitHub makes it easy to see how other developers handle things like configuration. 

Many times I will find something I didn't know about in another project, and after some research I'll have incorporated it into mine. But this isn't just about configuration. It's about anything, really.

> "Programming is standing on the shoulders of giants."

I think that's the saying, isn't it? There is so much information out there. So many examples to learn from. If you run into roadblocks trying to setup babel, npm scripts or configure webpack, going through GitHub issues or other config files can get you on the right path.

## Wrapping up

I hope this post has been useful to you if you're planning on jumping into the open source arena soon. I had a blast working on this project, and learned a ton from it. You can check it out [here](https://github.com/jakewies/flexomatic), and feel free to reach out to me via [Twitter](https://twitter.com/jakewies) if you have any questions. Goodluck!
