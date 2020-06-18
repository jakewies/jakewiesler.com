---
title: "Resolve Merge Conflicts in yarn.lock"
date: "2018-12-08"
description: "Getting merge conflicts in your yarn.lock file when attempting to merge pull requests into master can be a pain. In this post I'll describe a simple trick you can use to make the process a lot easier."
tags: ["Git"]
---

The `yarn` package manager creates a `yarn.lock` file when you install packages with `yarn add`. This file helps `yarn` determine the proper dependency versions to install.

I ran into a merge conflict recently between my branch's `yarn.lock` file and the one that existed on `master`. My first instinct was to resolve the conflicts by hand, but it felt wrong. According to [the documentation](https://yarnpkg.com/lang/en/docs/yarn-lock/#toc-managed-by-yarn), you shouldn't edit this file directly. `yarn` will manage it by itself. If this is the case, then what's the best way to handle these merge conflicts?

## A better solution

A [comment on GitHub](https://github.com/yarnpkg/yarn/issues/1776#issuecomment-269539948) shows a more efficient and safer way to get around this problem.

<warning>
  The comment discusses merge conflicts involving a `master` branch. This post
  will describe how to handle conflicts involving _any_ branch.
</warning>

The first thing you need to do is rebase against the branch you're attempting to merge into:

```
git rebase <SOME_BRANCH>
```

This command will take all the commits on your branch and "replay" them on top of `<SOME_BRANCH>`. If you're unfamiliar with rebasing in `git`, [here's a good primer](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase).

`git` will `rebase` each commit one at a time. Eventually you will run into your first conflict in `yarn.lock`. What you want to do is checkout the version from the branch you are rebasing against:

```
git checkout -- yarn.lock
```

Understanding this command requires some knowledge of rebasing in `git`. The first bit of context we have is a [GitHub comment](https://github.com/yarnpkg/yarn/issues/1776#issuecomment-297124714) in the same issue as the one I linked above:

> "I'd recommend `git checkout -- yarn.lock`, which is more general and just resets it to whatever is committed on your current branch."

The GitHub user [**@idris**](https://github.com/idris) recommends this command over the one shown in the first comment. But why? What do they mean by "more general", and what is the "current branch"?

At first it would seem that the _current branch_ is our branch. At least that's how I perceived it. This confused me, so I took to Google. After some digging I found [this StackOverflow comment](https://stackoverflow.com/a/3052118/4586720). It explains the concept in detail.

During a rebase, the current branch is the branch that you're rebasing against. In this case we are rebasing against `SOME_BRANCH`, so it is the current branch.

This means that running `git checkout -- yarn.lock` resets `yarn.lock` to whatever exists on `SOME_BRANCH`.

The command is the same as running:

```
git checkout SOME_BRANCH -- yarn.lock
```

The comment from **@idris** says we can omit the name of the branch, making the command "more general". `git` will just give us the file from whatever branch we're rebasing against.

Pretty neat! 💯

After checking out the other branch's `yarn.lock` file it's time to install **your** branch's dependencies:

```
yarn install
```

`yarn` will update the contents of `yarn.lock`, using your branch's `package.json` for context.

Once the process finishes you can add `yarn.lock` and continue with the rebase:

```
git add yarn.lock

git rebase --continue
```

Depending on the situation you may run into further conflicts for each commit. All you have to do is rinse and repeat the steps above. That's all, folks!
