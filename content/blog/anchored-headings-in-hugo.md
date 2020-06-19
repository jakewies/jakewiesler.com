---
title: 'Create Anchored Headings in Hugo Using Shortcodes'
date: '2018-10-15'
description:
  "Anchored headings are a useful feature in a blog that allows readers to jump
  to specific sections of the article or share that section with a friend.
  Unfortunately, this feature cannot be implemented in markdown without the use
  of Hugo's custom shortcodes."
tags: ['Hugo']
---

<warning>
  A Twitter user, <a href="https://twitter.com/kaushalmodi">@kaushalmodi</a>,
  reached out to me with a helpful tip on achieving anchored headings without
  needing to rely on a shortcode. You can find the solution{" "}
  <a href="https://discourse.gohugo.io/t/adding-anchor-next-to-headers/1726/9?u=kaushalmodi">
    here
  </a>
  . If retaining full markdown syntax in your content is priority, I recommend going
  with this route.
</warning>

In [Hugo](https://gohugo.io/), your content is authored in markdown. This is one
of the great features of the static site generator. It makes things very simple
for users such as myself who spend most of their time on the platform writing
blog posts. Unfortunately, that simplicitly is both a blessing and a curse.

There will inevitably come a point where your content requires a bit more
complexity than markdown can handle. This usually leads authors finding
themselves writing custom `html` inside of their `.md` files. Although valid,
it's a forced solution. A better solution would be to use Hugo's
[shortcodes](https://gohugo.io/content-management/shortcodes/).

Recently I decided to update a few parts of this site to improve the experience
of my visitors. One of the updates was to anchor all of the section headings in
my blog posts with `a` tags, allowing anyone to jump to that section with a
simple click or to specifically share that section with someone else. This is a
common feature in a lot of blogs.

Before I had this idea, my headings inside `.md` files would be prefixed with
the usual `#` symbol:

```md
## Look ma, a header!
```

This outputs the following `html`:

```html
<h2 id="look-ma-a-header">Look ma, a header!</h2>
```

<warning>
  Hugo processes markdown content using{" "}
  <a
    href="https://github.com/russross/blackfriday#sanitized-anchor-names"
    alt="link to BlackFriday"
  >
    Blackfriday
  </a>
  , a markdown processor that is implemented in Go.
</warning>

What I want is to have an `a` tag in the `h2` that links to the heading.
Something like this:

```html
<h2 id="look-ma-a-header">
  <a href="#look-ma-a-header">#</a>
  Look ma, a header!
</h2>
```

My first attempt at solving this problem was to write the above `html` in the
`.md` file itself. Although this works, it's extremely clunky. Imagine yourself
needing to add that snippet to _every_ heading in _every_ blog post. No thanks.

I then began to research whether or not there was a way to abstract this snippet
into a single file, and include it in `.md` files as necessary. I was already
doing this with Hugo's template files using
[partials](https://gohugo.io/templates/partials/#readout), so it seemed logical
that there would be a way to do this with my content files as well.

After rummaging through Hugo's docs for a few moments, I came across a page
describing **shortcodes**. Here's a definition straight from the
[docs](https://gohugo.io/content-management/shortcodes/):

> Shortcodes are simple snippets inside your content files calling built-in or
> custom templates.

Hugo comes with some
[built-in shortcodes](https://gohugo.io/content-management/shortcodes/#use-hugo-s-built-in-shortcodes)
for common use cases such as GitHub gists, syntax highlighting, Twitter posts,
and more, but unfortunately there is no shortcode for anchored headers. We can
circumvent this by defining a _custom_ shortcode instead.

## Defining a custom shortcode

In order to define a custom shortcode, you'll need to create a
`layouts/shortcodes/` directory. Once that's done, create an `html` file inside
the directory that has a name _equal to_ the shortcode you wish to define. For
example, a shortcode named `heading` will require an `html` template at
`layouts/shortcodes/heading.html`.

Inside of the template you'll need to add the `html` the shortcode should
output:

```html
<!-- layouts/shortcodes/heading.html -->

<h2 id="look-ma-a-header">
  <a href="#look-ma-a-header">#</a>
  Look ma, a header!
</h2>
```

Of course there shouldn't be any hardcoded values inside of the shortcode
itself. This is the only caveat. We'll need a way to tell the shortcode:

- the title of the heading
- the link of the heading

This can be done in a few ways.

## Named parameters

[Named parameters](https://gohugo.io/templates/shortcode-templates/#positional-vs-named-parameters)
can be passed to a shortcode at the time you call the shortcode in your content
files. Think of them as arguments to a function. In this situation it would make
sense to have two named parameters, `title` and `link`.

To call a shortcode with named parameters in your content file, you need to put
the name of the shortcode first, followed by your parameters:

```md
{{%/* heading title="Look ma, a header!" link="look-ma-a-header" */%}}
```

To [access](https://gohugo.io/templates/shortcode-templates/#access-parameters)
the parameters in the shortcode template we'll need to replace the hardcoded
text with the `{{ .Get "parameter_name" }}` syntax:

```html
<!-- layouts/shortcodes/heading.html -->

<h2 id="{{ .Get "link" }}">
  <a href="#{{ .Get "link" }}">#</a>
  {{ .Get "title" }}
</h2>
```

Now anytime you call the `heading` shortcode and pass it the proper parameters,
you will receive the `html` above with the parameter values in place. This a
perfectly adequate solution and works exactly as expected, however, I don't like
how we have to add both the `title` parameter _and_ the `link` parameter. Hugo
is powerful enough to generate the value of `link` for us based on the title of
the heading. Let's opt for this route.

## Generating the anchor link with `anchorize`

Earlier in the post I described how this markdown:

```md
## Look ma, a header!
```

generates this `html`:

```html
<h2 id="look-ma-a-header">Look ma, a header!</h2>
```

Hugo processes markdown content using
[Blackfriday](https://github.com/russross/blackfriday#sanitized-anchor-names), a
markdown processor that is implemented in Go. One of its features is to
[add anchors to headings](https://github.com/russross/blackfriday#sanitized-anchor-names)
in your `.md` files. That's why the `h2` above receives an `id` with a
_sanitized_ value of the content it holds.

Unfortunately, we opt out of this feature when using shortcodes, so it's up to
us to do the work ourselves. We can accomplish this with Hugo's
[anchorize](https://gohugo.io/functions/anchorize/) function, which takes a
string as its input and outputs a sanitized version in the same way that
Blackfriday does.

Let's update the `heading.html` template file to sanitize the `title` parameter:

```html
<!-- layouts/shortcodes/heading.html -->

<h2 id="{{ anchorize (.Get "title") }}">
  <a href="#{{ anchorize (.Get "title") }}">#</a>
  {{ .Get "title" }}
</h2>
```

<warning>
  `anchorize` expects one argument, so `(.Get "title")` is wrapped in
  parentheses.
</warning>

Now there is no need to pass the `heading` shortcode a `link` parameter,
removing some overhead and making things cleaner. Again, this a perfectly
adequate solution and you can stop here if your needs are met. However, there is
one more improvement we can make to this template file.

## Using the `.Inner` variable

The [.Inner variable](https://gohugo.io/templates/shortcode-templates/#inner)
receives a value equal to the content placed between an opening shortcode and a
closing shortcode. This is different to how shortcodes that rely on named
parameters work. Below is an example of how such a shortcode would be called in
a content file.

```md
{{%/* heading %}}Look ma, a header!{{% /heading */%}}
```

<warning>Closing shortcodes are optional.</warning>

Notice how the concept of an opening and closing shortcode is similar in nature
to `html` elements. The shortcode name must match in both the opening and
closing brackets, and the closing bracket should contain a `/` just like closing
`html` tags.

By calling the `heading` shortcode using the syntax above, the template file
will be able to access the text content `"Look ma, a header!"` via the `.Inner`
variable instead of a named parameter.

```html
<!-- layouts/shortcodes/heading.html -->

<h2 id="{{ anchorize .Inner }}">
  <a href="#{{ anchorize .Inner }}">#</a>
  {{ .Inner }}
</h2>
```

To keep things DRY, lets extract the call to `anchorize` out of the `html` and
into a variable:

```html
<!-- layouts/shortcodes/heading.html -->

{{ $anchorized := anchorize .Inner }}

<h2 id="{{ $anchorized }}">
  <a href="#{{ $anchorized }}">#</a>
  {{ .Inner }}
</h2>
```

Awesome! The template file is much cleaner and it works like a charm. You can
add a class to your `h2` element and style until your 💜's content. I would even
consider naming the `heading` shortcode something more succinct, like `h2`. That
way the declaration of your shortcode resembles that of a regular `h2` element:

```md
{{%/* h2 %}}Look ma, a header!{{% /h2 */%}}
```

One unfortunate downside to this is that you can't, in my knowledge, declare
dynamic `html` tags based on the heading you desire. For instance, instead of an
`h2` you may want to render an `h3`. This was my case.

Currently I just have a separate shortcode for each heading type, so an
`h2.html` and an `h3.html`. It's not the best, but it gets the job done. If
anyone knows how to render `html` tags using Go templates I'd love to know!

## Wrapping up

That's pretty much all there is to it. By now you should have a pretty solid
understanding of how shortcodes work in Hugo, and how to create an anchored
heading using shortcodes and the `anchorize` function. If you have any
questions, reach out to me on [Twitter](https://twitter.com/jakewies). Happy
coding!
