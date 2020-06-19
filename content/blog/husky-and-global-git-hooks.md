---
title: 'Using Husky with Your Global Git Hooks'
date: '2018-11-18'
description:
  "Husky is an awesome JavaScript tool that gives you the power to easily run
  pre-defined scripts as a git hook. When you install husky, the package will
  install git hooks local to your project in the .git directory. This has the
  unfortunate downside of overriding any global git hooks you've previously
  defined. In this post I'll describe how to make both work in harmony."
tags: ['Git', 'Tooling']
---

[Husky](https://github.com/typicode/husky) 🐶 is an awesome JavaScript tool that
gives you the power to run pre-defined scripts as a `git` hook with minimal
effort. When used together with
[`lint-staged`](https://github.com/okonet/lint-staged), you can really create a
nice developer experience for yourself. I've been using both on most of my
recent projects and I highly recommend them.

I use `husky` primarily to run a `pre-commit` hook, where I do some linting and
formatting, and even run some tests on changed files. This was working great up
until a few weeks ago when I started to notice that the script defined in the
`pre-commit` hook was not running.

## The problem

I spent several frustrating hours trying to debug the issue to no avail. This
led to some anger-induced Googling and a freshly created
[GitHub issue](https://github.com/typicode/husky/issues/391). The lone commenter
in that issue suggested taking a look at a `git` configuration option,
[`init.templateDir`](https://git-scm.com/docs/git-config#git-config-inittemplateDir),
to potentially solve my problem.

This was helpful for two reasons. For one, it was a spot on suggestion, but
we'll get to that. Second, it forced me to jump into the `git` documentation,
which I should've done in the first place.

After digging through the docs I realized my problem. I had recently created a
directory to hold my "global" `git` hooks. I then defined the path to that
directory using the `core.hooksPath` option in my `.gitconfig`.

```
~/.gitconfig

...

[core]
    hookspath = /path/to/global/git-hooks
```

This option,
[according to the docs](https://git-scm.com/docs/git-config#git-config-corehooksPath),
tells `git` where to find my hooks. What I didn't realize, was that if such an
option existed in my `.gitconfig`, then those hooks would be used in favor of
any defined _at the project level_, i.e. in my project's `.git/hooks` directory.
This includes the hooks that `husky` creates when you install the package.

> So, having a global `git` hooks directory affects my usage of `husky`

Frustrating. In my ideal world `git` would manage this better. 🤷🏼‍♂

## The solution

I needed to find a way to use both my global `git` hook and the `husky` hooks
without creating some complex workaround. Taking the
[suggestion of the commenter](https://github.com/typicode/husky/issues/391#issuecomment-436748951),
here's what I came up with.

### Create a template directory

First, I created a `git`
[template directory](https://git-scm.com/docs/git-init#_template_directory).

```shell
mkdir ~/path/to/git-template-dir
```

The contents of this directory, as long as they are not prefixed with a dot,
_will be copied to the `$GIT_DIR` after it's created._ The `$GIT_DIR`, in my
case, is just my project's `.git` directory, which is created when running
`git init`.

In order to tell `git` where to find this newly created directory, I defined its
location inside of `.gitconfig` using the `init.templateDir` option.

```
~/.gitconfig

...

[init]
    templateDir = /path/to/git-template-dir
```

<warning>I also removed the `core.hooksPath` definition inside of `.gitconfig`
because I no longer need it.</warning>

### Add your global hooks to the template directory

At this point, you'll need to move any globally defined `git` hooks to the new
template directory underneath a folder named `hooks`.

```shell
cd /path/to/git-template-dir

mkdir hooks
```

I ended up re-creating my lone hook instead of "moving" it. If you did the same,
make sure to set the proper permissions on the hook so that it is executable:

```
chmod a+x /hooks/<hook-file>
```

Now, whenever you run `git init`, the contents of your
`/path/to/git-template-dir/hooks` folder will be copied over to the `.git/hooks`
folder in your project.

## Supporting existing projects

The only caveat here is that this solution won't work with existing projects.
This is because `git` will only copy over the contents of your template
directory when you run `git init`.

If you have an existing project that you want to support, and you don't mind
re-initializing `git`, you can remove the `.git` directory and run `git init`
again. This isn't really ideal, especially if you value your `git` history. In
that case, I would suggest manually creating your hooks in the `.git/hooks`
directory of the project as a one-off type of thing.

## Summary

To wrap this post up, in order to solve my issue I created a template directory
and defined its location using the `init.templateDir` option inside of
`.gitconfig`. From there, I created a `hooks` folder inside of the template
directory, where I can now define my global `git` hooks.

`git` will then copy the contents of this template directory any time I run
`git init`. This means my global hooks will be accessible inside of any future
projects. I can then install `husky` as normal, and the package will create its
own `git` hooks alongside the ones I've defined globally.

I hope this helps any of you who have run into the same problem. Reach out to me
on [Twitter](https://twitter.com/jakewies) if you have any questions. Happy
coding!
