---
title: "Turn Your Hugo Webite Into A Theme"
date: 2020-06-10T11:40:00-05:00
slug: ""
description: "Many moons ago I built my personal site using Hugo, a static site generator written in Go. I've had many people inquire about the design of my site since then. Some have even asked for permission to use it. Because of this, I've decided to turn the entire website into one Hugo theme that can be used easily. Here's how I did it."
tags: ["Hugo"]
keywords: ["Hugo", "Theme", "Blog", "Go"]
draft: false
stylesheet: "post.css"
---
 
Many moons ago I built my personal site using Hugo, a static site generator written in Go. I've had some people inquire about the design of my site since then. Some have even asked for permission to use it. Because of this, I've decided to turn the entire website into one Hugo theme. [Here's a link to the theme's directory](https://github.com/jakewies/hugo-theme-codex) if you're curious.

I'm going to make this short and sweet. I will also make the assumption that you are familiar with Hugo and you already have a working site. Let's dive in.

## Getting started

The first thing to understand is that traditional Hugo sites and Hugo themes are not that different from each other. The only difference is where the code lives, either in the main project directory (i.e., the root of your project), or the `themes` directory. 

Hugo actually puts themes at the center of the [Quick Start](https://gohugo.io/getting-started/quick-start) tutorial by having the reader install a theme in [just the third step](https://gohugo.io/getting-started/quick-start/#step-3-add-a-theme) using the following syntax:

```
git submodule add https://github.com/username/test-theme.git themes/test-theme
```

<warning>This installs a theme named `test-theme` into the `themes/test-theme` directory.</warning>

The above command illustrates where a theme should live: in the `themes` directory. This is helpful information for us later, but for now we are going to shift focus to setting up a development environment that will allows us to build the theme and test the theme at the same time.

## Setting up a development environment

There are a few ways to go about this. I'm going to explain the way I chose:

1. Create a new project directory to store your theme
2. Copy all content from original website directory to new directory
3. Re-init theme folder with git
4. Create a `theme.toml` file


Steps 1 and 2 should result in a duplication of your website folder. 

Step 3 should start you off with a fresh git history.

Step 4 adds a new file to the mix - `theme.toml`. This file is crucial to your theme and needs to be populated with the right content. You can [refer to Hugo's documentation on `theme.toml`](https://github.com/gohugoio/hugoThemes#themetoml) for what should go in this file.

At this point, the new theme directory should look just like your old website directory, save for a new `theme.toml` file and a fresh git history.

## The example site directory

Once the 4 steps above are completed, we can move on to creating our example site. The example site is useful because it will let you test your theme in the browser as if you were a user of the theme. 

Create an `exampleSite` directory at the root of your theme directory. The only mandatory file in this directory is a `config.toml`. Hugo uses it to locate the theme you want to use for the example site.

```toml
#config.toml

theme = "name-of-your-theme-directory"
themesDir = "../../"
```

The `theme` key should be the name of your theme's directory. The `themeDir` key tells Hugo where to look for the theme directory. It will essentially concatenate the values of both keys and look for your theme at `../../name-of-your-theme-directory`. 

You can run the example site using:

```
cd exampleSite
hugo server -D
```

This should start your example site in the browser using your theme.

## Create example content

The Hugo team has a GitHub repository named [HugoBasicExample](https://github.com/gohugoio/HugoBasicExample) that provides the "default content" used for all theme demos, however there are cases where your theme does not align with the assumptions HugoBasicExample makes. 

In these cases the Hugo team can whitelist your theme so that it demos the contents of your `exampleSite` directory instead. This was my case, but it may not be yours. 

For this to work, you'll need to have an `exampleSite/content` directory with example content that will showcase your theme in action. Check the [`hugo-theme-codex`](https://github.com/jakewies/hugo-theme-codex/tree/master/exampleSite) repository for more information.

I would suggest having at least one piece of content for each [content type](https://gohugo.io/content-management/types/#readout).

## Configuration 

This step goes hand-in-hand with the one above. You'll need to decouple your theme from you. This is very much a solo step, as your site could be heavily coupled to you as an individual. So your mileage may vary here.  Some gotchas might include:

- header text
- social icons/links
- email addresses
- about page

My suggestion would be to go through every page in your theme and do a heavy analysis on what is crucial to the functionality and what is not. What needs to be abstracted away into configuration and what can stay. 

This was the longest part of the process for me. It brought up some valid questions about how the website was built, it forced me to adjust some pages so that they can be configured easily, and it even made me think about some constraints I wanted to have with my theme.

When this step is finished your website should be completely decoupled from your content and you are ready to submit your theme for review.

## Submit your theme

This is a very straightforward step. The Hugo team has a repository named [hugoThemes](https://github.com/gohugoio/hugoThemes) that manages all of the official themes available. In order to submit yours you'll need to:

1. Push your theme repository to GitHub
2. Make sure your theme meets [these requirements](https://github.com/gohugoio/hugoThemes#adding-a-theme-to-the-list)

<warning>Step 2 includes a few administrative tasks not mentioned in this post, like getting theme screenshots and detailing a `README`.</warning>

Once the steps above are complete you can go to the [hugoThemes repository](https://github.com/gohugoio/hugoThemes) and file an issue for your theme, which is the standard process for submitting your theme for approval. 

## Conculsion 

And that's it! The team at Hugo didn't take long to help me align my theme and get it up on the official themes list. Here are a few links that might help you with context:

- My Hugo theme repository [`hugo-theme-codex`](https://github.com/jakewies/hugo-theme-codex)
- [The issue I filed to submit my theme](https://github.com/gohugoio/hugoThemes/issues/863)
- The official list of [Hugo Themes](https://themes.gohugo.io)
- The [hugoThemes](https://github.com/gohugoio/hugoThemes) directory

Please reach out on [Twitter](https://twitter.com/jakewies) if you have any questions!
