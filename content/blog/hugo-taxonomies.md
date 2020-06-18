---
title: "Add Tags to Your Hugo Blog Using Taxonomies"
date: "2018-11-21"
description: "The Hugo static site generator has a feature known as taxonomies, which gives users the ability to define relationships between their content. Taxonomies can be thought of as categories for your content. In this post we'll explore taxonomies in Hugo using blog post tags as an example."
tags: ["Hugo"]
---

Since the inception of this blog, I've wanted to add "tags" to my posts. Readers could then browse a list of related posts based on a specific tag. Using Hugo's nifty **taxonomies** feature, I was able to easily built out that functionality.

Taxonomies are used to define relationships between your content. `tags` is an example of a taxonomy. In fact, it is also one of the [two default taxonomies](https://gohugo.io/content-management/taxonomies/#default-taxonomies) that Hugo supports _out-of-the-box_. 📦 

## Configuring the `tags` taxonomy

Because the `tags` taxonomy is a Hugo default, the necessary site configuration is practically non-existent. You don't need to adjust your config at all. In my case, I had no plans of using the other default taxonomy, `categories`, so I took [an additional step to remove it](https://gohugo.io/content-management/taxonomies/#example-removing-default-taxonomies). This is not necessary.

<warning>
  If you wish to define your own taxonomy rather than use one of the defaults, refer to the <a href="https://gohugo.io/content-management/taxonomies/#configuring-taxonomies" alt="Hugo docs">Hugo docs</a>.
</warning>

## Defining `tags` in your blog posts

Now that your site is properly configured to support the `tags` taxonomy, it's time to actually define some in your posts. This is done in the front matter of your post's content file:

```yaml
# content/blog/a-blog-post.md

---
title: "A Blog Post"
tags: ["value_1", "value_2"]
---
```

`"value_1"` and `"value_2"` are individual tags. The post above will form a relationship with any other post that shares one of these tags. 

One of the main goals I wanted for this blog was to have dedicated pages for each tag. These pages would then render a list of posts that all have that tag in common. This creates a better experience for the reader, giving them the ability to browse related posts. 

Luckily, Hugo [creates](https://gohugo.io/content-management/taxonomies/#default-destinations) these _list pages_ for each taxonomy value you define, even if they are only used once. Using the example above, list pages will be created at:

- `/tags/value_1`
- `/tags/value_2`

In order for actual content to be rendered on these pages, we'll need to define a special template.

## Taxonomy list templates

Hugo uses templates to render content, and these templates reside in the `layouts/` directory. With taxonomies this is no different. 

Using a [taxonomy list template](https://gohugo.io/templates/taxonomy-templates/#taxonomy-list-templates), you can render a list of blog posts that share the same tag. The [lookup order](https://gohugo.io/templates/lookup-order/) for these templates can get a little confusing. There are a number of naming conventions and file placements you can use. 

I achieved this by creating a `layouts/taxonomy` directory, and inside of that directory a `tag.html` file:

```
layouts/
  taxonomy/
    tag.html
```

Using the example from the last section, `tag.html` will be the list template that Hugo uses to render the `/tags/value_1` and `/tags/value_2` pages. 

The following markup can be used in the list template to render posts with related tags:

```html
<!-- layouts/taxonomy/tag.html -->

<ul>
  {{ range .Data.Pages }}
    <li>
      <a href="{{.RelPermalink}}">{{ .Title }}</a>
    </li>
  {{ end }}
</ul>
```

Now, if you go to the `/tags/value_1` page, you should see a list of blog posts that all contain the tag `"value_1"`. 😆

## Render tags in content pages

The last feature I want to support is listing all of the tags for a specific blog post on that post's page. This took a little bit of digging to figure out. 

First, create a new [partial template](https://gohugo.io/templates/partials/) in `layouts/partials` called `tags.html`. Add the following markup to the file:

```html
<!-- layouts/partials/tags.html -->

{{ $taxonomy := "tags" }}
{{ with .Param $taxonomy }}
  <ul>
    {{ range $index, $tag := . }}
      {{ with $.Site.GetPage (printf "/%s/%s" $taxonomy $tag) -}}
        <li>
          <a href="{{ .Permalink }}">{{ $tag | urlize }}</a>
        </li>
      {{- end -}}
    {{- end -}}
  </ul>
{{ end }}
```

The code above will check to see if `tags` are defined for a given post. If they are, the tags will be rendered in an unordered list, with a link to each tag's list page (i.e. `/tags/value_1`). 

Now, you can add this partial template to your blog's single page template. Mine is defined at `layouts/blog/single.html`:

```html
<!-- layouts/blog/single.html -->

<!-- ... -->

{{ partial "tags.html" .}}
```

With that, all of your blog posts will render a list of their `tags` if they are defined.

### Preserving taxonomy values

One little gotcha about taxonomy values in Hugo is that their names are normalized. To preserve the values that you explicitly define, you can [add a special option](https://gohugo.io/content-management/taxonomies/#preserve-taxonomy-values) to your site's configuration called `preserveTaxonomyNames` and set it equal to `true`.

## Conclusion

The examples above should get you up and running with a simple tags setup for your Hugo-powered blog. The template markup contains simple list elements with anchor links, and I've purposefully left out any styling suggestions. 

90% of the information found in this post can be applied to custom taxonomies as well. The only difference is that you will need to [define the taxonomy](https://gohugo.io/content-management/taxonomies/#configuring-taxonomies) in your site's configuration and adjust the naming of your taxonomy list template. 
