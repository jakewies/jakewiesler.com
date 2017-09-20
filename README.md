## Styles

Styles are written using the pre-processor Stylus.

All Stylus source files are located inside `src/styles`. The directory structure is as follows:

```
src/
    styles/
      base/
        _reset.styl
        _typography.styl

        ...

      <page_1>.styl
      <page_2>.styl
      <page_3>.styl
```

Each static page will contain 1 CSS file. They can uniquely `@import` whatever they need from the more general `.styl` partials located in the `base/` directory, as well as contain styles unique to the page itself.

### Example

```
/* about.styl */

@import 'base/_reset'

main 
  background: red



/* blog.styl */

@import 'base/_reset'

main
  background: blue
```

This keeps things as DRY as possible while preventing styles from loading on a page that doesn't require them. This workflow could change in the future.

### Where does Gulp fit in?

Gulp watches for file changes in the `src/styles/` directory, and will then take the `.styl` files in the root of the `src/styles/` folder (the files for each page) and process them to CSS before moving them to the `/static/css/` directory. 

### Declaring a CSS file for each page

A special parameter, `stylesheet`, should be included in a page's content Front Matter, with a value equal to the stylesheet required. 

```
/* content/blog/_index.md */

+++
stylesheet = "blog.css"
+++


/* content/work/_index.md */

+++
stylesheet = "work.css"
+++
```

This parameter is exposed to templates in the `layouts/` directory, namely the base layout `layouts/_default/baseof.html`. It can be accessed in using the `.Params` variable:

```html
<!-- layouts/_default/baseof.html -->

<link rel="stylesheet" href="/css/{{ printf .Params.stylesheet }}" />
```






