---
title: "My Commit Workflow"
date: "2018-12-20"
description: "In this post I want to share a simple git commit workflow I use in most JavaScript projects to keep my commits clean and safe."
tags: ["Git", "Tooling"]
---

Committing work was never something I gave much thought. It was a necessary step from development to production. That's it. Over time I've learned that, like many things involving `git`, committing is a subtle art. In this post I want to share a simple workflow I use in most JavaScript projects to keep my commits clean and safe.

At the heart of this workflow is the idea that _staged code_, or code ready to be committed, requires some analysis. How you do this depends on the language you work with, but the strategies are similar.

My strategy is to lint, format, and test staged code before committing. In JavaScript land, the tools I use for this are `eslint`, `prettier`, and `jest`, respectively.

<warning>
  In TypeScript projects you can substitute `tslint` in place of `eslint`.
</warning>

## Analyzing staged code

The key is to run the tools mentioned above **only** on code that is being committed. This requires two more tools - [`husky`](https://github.com/typicode/husky#readme) and [`lint-staged`](https://github.com/okonet/lint-staged). They provide a ton of value with little effort to configure.

### `husky`

```
yarn add husky -D
```

`husky` makes it easy for you to run scripts on `git` hooks. The hook I use most is `pre-commit`. Here's how to configure it:

```json
// package.json

{
  "husky": {
    "hooks": {
      "pre-commit": "npm run <something>"
    }
  }
}
```

Now, when running `git commit`, `npm run <something>` will run first. The command can be anything. In my case I want to run a command that lints, formats, and tests **only** staged code. But how can I target staged code?

### `lint-staged`

```
yarn add lint-staged -D
```

`lint-staged` is the tool that lets you do that. It will run commands on staged files. You can also target specific files: `.js`, `.css`, `.ts`, etc:

```json
//package.json

{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": ["eslint", "jest --findRelatedTests"],
    "./**/*.{js,json,css,md}": ["prettier --write", "git add"]
  }
}
```

<warning>
  There is some nuance when using `prettier` and `eslint` together. If you're
  not aware of this, things can get annoying. I use{" "}
  <a href="https://github.com/prettier/eslint-config-prettier">
    `eslint-config-prettier`
  </a>{" "}
  to prevent conflicts.
</warning>

Notice that now I'm telling `husky` to run `lint-staged` on the `pre-commit` hook. In turn, `lint-staged` will run two commands:

1. `eslint && jest --findRelatedTests` on any staged `.js` files.
2. `prettier --write && git add` on any staged `.js`, `.json`, `.css`, and `.md` files.

If any of the commands above result in an error, I will not be able to proceed with the commit. This is the benefit.

## Conclusion

The majority of projects can get by with the configuration shown here. I've created a [GitHub repo](https://github.com/jakewies/commit-workflow/tree/master) so that you can play around with the workflow. Familiarize yourself with how these tools work together. If you have any suggestions/improvements please feel free to open up a PR.
