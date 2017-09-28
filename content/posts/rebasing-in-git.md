---
title: "Rebasing in Git"
date: 2017-09-27T18:08:15-04:00
draft: true
stylesheet: "post.css"
---

Sometimes a feature branch contains a bunch of random commits, with random commit messages. In order to make things clearer in the git history and aid others in deciphering what the feature branch is really doing, it is necessary to “sqaush” these little commit messages into 1 commit with a more succinct description of the branch’s changes.

> Est veniam incididunt quis ex minim Lorem ea non qui. Velit exercitation sit duis commodo amet nisi enim sunt fugiat est in cillum fugiat fugiat. Enim aliqua amet adipisicing laborum exercitation eu nulla consectetur. Esse ex ad cupidatat non ad labore cillum sint nostrud esse quis esse deserunt. Dolor irure voluptate commodo amet nulla aliqua ullamco ad.

## Squashing a commit

In order to do this, we need to perform an `interactive rebase`.

Command:

```
git rebase -i Head~n testsetsetsetsetsetsetsetsetsetsetsetsetset
```

The command above lets you rebase `n` commits on your branch. If you want to squash all the commits from the `merge-base`, or the commit where it branched off of `master`, or whatever parent branch your branch came from, you can use this command:

```
git merge-base <name of branch> <name of parent branch>
```

This should spit out a giant hash like : 

```
1881e40a619f809d8eaf475dc52769fb9901366d
```

Using this hash, you can then rebase ALL commits on your feature branch using:

```
git rebase -i <hash>
```

This will bring up a text editor in your terminal with all the commits on the branch like so:

```
pick 1fc6c95 do something
pick 6b2481b do something else
pick dd1475d changed some things
pick c619268 fixing typos
```

These commits are ordered from oldest to newest (newest on the bottom). You can use a number of commands where `pick` is located. To squash a commit, and meld it into the previous commit ( the one on top of it ), just replace `pick` with `squash` or `s` for short.

```
pick 1fc6c95 do something
s 6b2481b do something else
s dd1475d changed some things
s c619268 fixing typos
```

This will squash the 3 newest commits into the 1st and original commit. Saving the file will then bring up a new editor Allowing you to reword a commit message that will be used for the squashed commit. This is cool because you can work on a branch, committing whenever it pleases you, [try this](https://github.com/edx/edx-platform/wiki/How-to-Rebase-a-Pull-Request) making random commit messages, and then at the end squash them all together into a clean and understandable commit message that others will be able to interpret without pulling their hairs out.

### Cool Resources

[How to Rebase a Pull Request · edx/edx-platform Wiki · GitHub](https://github.com/edx/edx-platform/wiki/How-to-Rebase-a-Pull-Request)

[Git Interactive Rebase, Squash, Amend and Other Ways of Rewriting History](https://robots.thoughtbot.com/git-interactive-rebase-squash-amend-rewriting-history)