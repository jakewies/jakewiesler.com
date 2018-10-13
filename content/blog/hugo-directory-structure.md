---
title: "Hugo's Directory Structure Explained"
date: 2017-10-17T09:54:15-04:00
slug: "hugo-directory-structure"
description: "Hugo is a static site generator written in Go, and is incredibly fast. This article will introduce you to the core principles of its directory structure and will help you get started building websites quickly."
keywords: ["hugo", "directory"]
draft: false
stylesheet: "post.css"
---

When I first started working with Hugo I had some difficulty grasping the relationships between certain directories in my project. It can feel like there is a lot of abstraction going on in the background that you're not aware of. Things like naming conventions and lookup orders that you wouldn't know about without diving headfirst into the [official documentation](https://gohugo.io/documentation/).

It took some time, but I can definitely say that the architectural decisions made by the Hugo team feel so intuitive. The default directory structure is light, containing only a few folders at the project's root along with a config file holding some meta information. When you start a new project it will look like this:

```markdown
archetypes/
content/
data/
layouts/
static/
themes/
config.toml
```

This post goes over what I consider to be the core of the Hugo directory:

1. Content
2. Layouts
3. Archetypes
4. Static

I'll explain each one in order of "most useful", which is completely subjective, but understanding a certain directory's purpose will help you understand the purpose of the next. 

### A note on themes

Hugo allows for theme creation and they have a number of community-built themes that you can choose from if you don't feel like doing the leg work. This is apparent when going through their [Quick Start](https://gohugo.io/getting-started/quick-start/) guide. 

Working with existing themes or building your own adds an additional layer to the directory structure of your project. It is not something that I will cover in this post. If you're looking to build a theme or alter an existing one then this post may not be for you. That being said, if you understand how the above directories work you'll have no issues working with themes in Hugo.

### Content

The `content/` directory holds all the content of your site. 

_Who would've thought._ 

Seriously though, I'm writing this post in the `content/` directory right now. It is made up of the sections and static pages that structure a website. 

There's a distinct difference between the terms _sections_ and _static pages_ and it's pretty easy to grasp:

A **section** is a portion of the site that holds subcontent, such as a blog section and a work section. The blog section contains individual blog posts, and the work section is a portfolio of individual projects.

A **static page** is simply a page that renders content and nothing else. It doesn't need to index a list of subcontent for the user to peruse. The about page is a good example. If you view it in the browser, you can't go down any further. It's the about page and that's it.

So, if you were tasked to create a simple website containing this structure:

- Homepage
- About
- Blog
- Contact
- Work

Your `content/` directory would potentially look like this:

```markdown
content/
    about.md
    blog/
    contact.md
    work/
    _index.md
```

The about and contact pages are static and are therefore defined as `.md` files at the root of `content/`. Blog and work are sections of the site containing subcontent, so they are structured as directories.

The `_index.md` file plays an important role here. Hugo requires that an `_index.md` file be explicity defined at the root of `content/`, and it uses this file to render the homepage of your site.

#### Content types

All markdown files that exist inside `content/`, whether at the root or in subdirectories, have a `type` associated to them. Hugo infers a markdown file's `type` in one of two ways:

1. The name of the subdirectory that the file resides in
2. The `type` variable defined in that file's front matter (optional)

The former is pretty simple to understand. Hugo will initially deduce a markdown file's type by simply looking at the name of the subdirectory it is in. The file `a-blog-post.md` located at `content/blog/a-blog-post.md` will have the type `blog`. If it were located at `content/posts/a-blog-post.md` it would have the type `posts`. 

You can override this behavior by defining the `type` variable inside of the file's [front matter](https://gohugo.io/content-management/front-matter/). We won't be explaining front matter in this post, but it's basically metadata defined at the top of a file such as its `title`, `date`, and `description`. 
There are a lot of cool things you can do with front matter and I'll list a few later on, but just know that you can explicitly define a file's type here and it will override the default type inferred from the subdirectory it is in.

So if you're wondering: Yes. You _can_ have a file at `content/blog/a-blog-post.md` with a type explicitly set to `pizza`.

#### List pages vs single pages

Another concept to understand about the markdown files that exist in the `content/` directory is that they can represent **list pages** or **single pages**. To illustrate this, let's continue to use the example given above.

You now know that the blog section must be defined as a subdirectory of `content/`. It will contain individual blog posts written as `.md` files:

```markdown
content/
    blog/
        a-blog-post.md
        another-blog-post.md
        _index.md
```

Notice that there are two posts and an `_index.md` file inside of `blog/`. The posts represent _single pages_ in the blog section. The purpose of `_index.md` is to index these posts and is therefore considered a _list page_. 

This concept holds true for all subdirectories of `content/`. Each one must contain an `_index.md` file which gains access to all single pages in that section. This access grants the `_index.md` file the ability to list out all the single pages.

If you navigate to `www.yoursite.com/blog`, the `_index.md` file will be used as the content for that specific route. It will render a list of blog posts that exist in the blog section. Pretty neat, huh?

## Layouts

The `layouts/` directory is nothing more than a directory of templates. Each provides a consistent _layout_ when rendering the markdown files that exist in `content/`. It is, in my opinion, the most crucial directory in a Hugo project. I feel this way because although Hugo has a set of rules as to how templates should work, the developer can implement them in a number of ways. 

### List templates vs single templates

Are you starting to see a trend? Lists and singles are one of the foundations of Hugo and they are at the heart of the `layouts/` directory. List templates and single templates do exactly as they sound: render list pages and single pages.

### Template lookup order

To understand the `layouts/` directory you must understand how Hugo resolves which template to use to render content. It does this by using a **lookup order**, or a list of filepaths to inspect, hoping to find an appropriate template.

In theory, your project could run on only two templates: a single and a list template. This is sufficient enough to handle all the content on your site. Your `layouts/` directory would then look like this:

```markdown
layouts/
    _default/
        single.html
        list.html
```

Hugo looks in the `_default/` directory if it cannot find any other template to use to render a specific piece of content. Think of `_default/` as Hugo's "last resort". A quick tip: when creating a Hugo project for the first time your `layouts/` directory will be empty. This means that you must create the `default/` subdirectory yourself.

If you decided to go this route it would mean that all list pages would render with the same template. This holds true for single pages as well. Why? Well, you've only given one template for each page type. Hugo will just resolve to using that template when it finds itself at the `/default` directory during the lookup order.

This may not seem like an issue until you want to structure your `content/blog/_index.md` list page differently from your `content/work/_index.md` list page. How would you handle that?

### Templates based on content type

Since Hugo gives you a number of ways to create "different" pieces of content, it must also give you a way to uniquely template them. Take a step back and think about how the `content/` directory was structured:

```markdown
content/
    about.md
    blog/
    contact.md
    work/
    _index.md
```

Remember content types? This is where they start to come in handy. If you want to use unique templates for specific content types, you can create subdirectories inside `layouts/` for each type. For example, if you wanted the blog list page and all the blog single pages to use a separate set of templates from the rest of your site, you could define those templates in a `layouts/blog/` directory:

```markdown
layouts/
    _default/
        single.html
        list.html
    blog/
        single.html
        list.html
```

During the lookup order Hugo will resolve to use `layouts/blog/list.html` template for the blog list page and `layouts/blog/single.html` for all of the blog posts. Everything else will just inherit the templates inside `layouts/_default/`. Useful.

Let's assume that you want to extend this template specificity for every content type on your site. Your `layouts/` directory would continue to "mirror" your `content/` directory by accepting subdirectories named after each content type.

```markdown
layouts/
    _default
        single.html
        list.html
    blog/
        single.html
        list.html
    work/
        single.html
        list.html
```

Looking good, but what about the about page and the contact page? They would currently be rendered using the `_default` templates. That is sufficient enough, but I'm going to push a personal strategy on you:

> I think its best to explicitly define templates for each content type you have on your site.

So let's do that. But first, a question. _What content type does the about page and the contact page actually have?_ Remember how we said that content types are determined in one of two ways:

1. The `content/` subdirectory it is in
2. The `type` variable defined in the file's front matter

Well, the about page and contact page aren't in a subdirectory of `content/`, so number one doesn't help us. But, we can appease number two by defining a content type in each page's front matter. 

As I said before, this post doesn't cover front matter in depth, but this occasion requires a slight detour. For content pages that live at the root of `content/`, I like to explicitly define the `type` variable inside their front matter with a value of `static`.

```markdown
// content/about.md & content/contact.md

---
type: "static"
---
```

I got this idea while reading one of Sara Soueidan's [blog posts about migrating her site to Hugo](http://www.sarasoueidan.com/blog/jekyll-ghpages-to-hugo-netlify/). It was a massive help for me at the beginning.

Once we define the `type` variable inside a file's front matter we can create a subdirectory inside `layouts/` in order to template those files directly:

```markdown
layouts/
    _default
        single.html
        list.html
    blog/
        single.html
        list.html
    work/
        single.html
        list.html
    static/
        single.html
        list.html
```

This paradigm is really powerful and makes working with Hugo an absolute breeze.

### Homepage templates

There's another page inside of `content/` that we haven't discussed: The homepage. Just like the homepage gets its own markdown file inside of `content/`, it too can have its own template file: `layouts/index.html`:

```markdown
layouts/
    _default
        single.html
        list.html
    blog/
        single.html
        list.html
    work/
        single.html
        list.html
    static/
        single.html
        list.html
    index.html
```

Hugo doesn't require this, but I like to err on the side of explicit where possible. If you forego a `layouts/index.html` file, Hugo will then look to `layouts/_default/list.html` to render the homepage. At first I didn't understand why. I figured the homepage was a single page and would be rendered with a single template. But it's not. 

It's actually a list page. In the `content/` directory the homepage is `_index.md`, sharing the same name with all other list pages in `content/` subdirectories. It _lists_ that which exists at the root of `content/`: _ipso facto_ your entire website.

### Base templates

Here's an interesting tip that took a while for me to discover in the Hugo docs: You can have a base template which all other templates inherit from. This template is the Queen Bee, and she is named `baseof.html`. 

There can actually be a number of these `baseof.html` files in your `layouts/` directory, and [Hugo's lookup order for base templates](https://gohugo.io/templates/base/#base-template-lookup-order) can get a bit confusing. That's why I choose to have only one located at `layouts/_default/baseof.html`. 

This file is the master template that contains a lot of the standard html I wouldn't want to include in every template. Things like the document head, stylesheets and js files. I declare them once and all other templates inherit from it. 

I'll be writing a post specifically on the relationships between all of these templates soon so be on the lookout for it!

## Archetypes

One of Hugo's main draws is that it gives the developer the ability to create new types of content quickly. Archetypes make this possible. The `archetypes/` directory can contain markdown files named after content types on your site. Examples of this would be: `blog.md`, `work.md`, and of course, `pizza.md`.

Inside these "archetypes" are default parameters defined via front matter that every new piece of content associated with this archetype will inherit. When you first start a new Hugo project the `archetypes/` directory will only contain a `default.md` file. All new content files generated via the command line will inherit from this archetype unless an archetype exists specifically for that content type.

### Generating content files with archetypes 

You can generate new content files using the `hugo new` command:

```shell
hugo new <content_type>/<file_name>
```

Hugo will traverse the `archetypes/` directory to see if any archetypes match the value of `<content_type>`. If none are found it will use `default.md` to generate the file.

If you wanted to have all of your blog posts contain specific front matter separate from other content types, and assuming your blog posts live at `content/blog/`, you would define a `blog.md` archetype with the desired front matter defined. Then create a new blog post from the command line:

```shell
hugo new blog/a-new-post.md
```

A file at `content/blog/a-new-post.md`  will be created that contains all pre-defined front matter.

### Why would you want to do this? 

Maybe your blog posts have a `description` parameter and a `keywords` parameter that other content types don't have. Maybe you don't want to manually create these files by hand every single time. It comes in handy and makes your life as a developer that much easier. Automation for the win! 

## Static

The `static/` directory is pretty straightforward. All assets are placed here and can then be used throughout the project. 

```markdown
static/
    css/
        styles.css
    js/
        index.js
```

Using the structure above, you can reference both files using a filepath relative to the `static/` directory such as `/css/styles.css` or `/js/index.js`.

### Managing your assets

One of the things Hugo lacks is an asset pipeline. It doesn't have any opinions on how you should handle your css, js, images, and fonts. All that matters is that the final assets are in this folder when you want them to be usable on the site. How they get there is up to you. 

I opted for a simple Gulp workflow, writing all of my css and js in a `src/` directory, watching for changes, and compiling->outputting to `static/`. I'll be writing a post on specifics soon as well.

## Wrapping up

I hope this post has proved useful to you on your quest to master Hugo. It is still a very new tool for me, but I've been digging my initial experience. The directory itself is minimal and that's one of the things I enjoy about it. The less mental overhead the better, right? 

You can do some pretty awesome things once you understand how these core directories are working with each other. There are projects that exist such as [Victor Hugo](https://github.com/netlify/victor-hugo) that take Hugo's architecture to the next level. This is a project you'll definitely want to check out if you are interested in an advanced workflow.

I'll continue to post regularly about some tips and tricks I learn along the way. If you have any questions or want to correct a mistake in this post, or even if you just want to talk shop, feel free to reach out to me via [Twitter](https://twitter.com/jakewies)!