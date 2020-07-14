---
title: 'How I Delete Files in WSL 2'
date: '2020-07-14'
description: "Recently I started developing on my Windows machine with Windows Subsystem for Linux 2 and Ubuntu 20.04. I want to have a way to safely use `rm` to delete files, and I have found a good solution that works for me."
tags: ['Linux']
---

Deleting files from your terminal can be risky business if you don't know what you're doing. One bad keystroke and your entire day can go down the gutter. Trust me, I've been there. So what's the best way to delete a file or directory via the terminal? 

Last week I decided to bootstrap a development environment on a PC that I had built a few months back. The PC specs are such that I am able to _easily_ write code and stream it for others on [Twitch](https://www.twitch.tv/jakewies), something my aging MacBook just can't accomplish. Poor thing. It's almost time to put it down for the long nap.

Anyway, I had a pretty solid setup on the MacBook and I wanted to mirror it as closely as possible on the PC. [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about) has come a long way in recent months, and we're now at version 2 of the implementation. I found it pretty easy to get up and running with a full-on Linux environment using Ubuntu 20.04. All the Unix goodness on my PC? How cool.

On the MacBook I had used an `alias` to safeguard myself from the pitfalls of the [`rm` command](http://linuxcommand.org/lc3_man_pages/rm1.html) when deleting a file or directory. The `alias` replaced the default `rm` command with [`trash-cli`](https://github.com/sindresorhus/trash-cli), a tool written by [@sindresorhus](https://sindresorhus.com/). It worked incredibly well. Deleting files or directories via the terminal would move them to the Trash, which is easily accessible from the User Interface. From there I could decide whether or not to empty the trash completely. 

I opted to use the same tool in my Linux environment. I have `node` and `npm` configured properly, so all that was needed was a quick:

```shell
npm i -g trash-cli
```

Followed by aliasing `rm` to `trash`:

```shell
# .aliases

alias rm='trash'
```

Now, anytime I run `rm some-file.js` or `rm some-directory`, I can sleep at night. 

## Locating trashed files

I half expected deleted files/directories to show up in the Windows Recycle Bin, but after a quick test I realized they were not. I did some digging through the [repository issues](https://github.com/sindresorhus/trash-cli/issues) and found one issue titled ["File deleted but not in Recycle Bin"](https://github.com/sindresorhus/trash-cli/issues/24). If you read through the issue you'll notice that it is pretty spot on with what I've experienced.

It turns out the Sindre closely follows [The FreeDesktop.org Trash specification](https://specifications.freedesktop.org/trash-spec/trashspec-1.0.html). This describes exactly how a Trash implementation should be written. Using this spec I was able to discover the `Trash` directory located at ` ~/.local/share/Trash/`. This directory contains two separate directories, `Trash/files/` and `Trash/info/`. Each of which contain information on the files that have been deleted. 

According the spec:

> The **$trash/files** directory contains the files and directories that were trashed. When a file or directory is trashed, it MUST be moved into this directory.

> The **$trash/info** directory contains an “information file” for every file and directory in $trash/files. This file MUST have exactly the same name as the file or directory in $trash/files, plus the extension “.trashinfo”.

The names of these files is up to the implementation itself, and `trash-cli` seems to use a randomly generated UUID. If you're curious as to how you can tell which file is which, go into the `Trash/info` directory and view the contents of any `.trashinfo` file. For example, if I deleted a file named `test.js` which was located at  `/root/projects/`, the `.trashinfo` file would contain the following contents:

```
[Trash Info]
Path=/root/projects/test.js
DeletionDate=2020-07-14T21:23:53.255Z
```

## Erasing the trashed files

My naivety thought I could simply `rm` these trashed files to "empty the trash", but because I aliased `rm` already, I found myself in an endless loop of trashing trashed files. Sindre actually created another tool (the dude is prolific) called [`empty-trash-cli`](https://github.com/sindresorhus/empty-trash-cli). You can also install it along `trash-cli` using:

```
npm i -g empty-trash-cli
```

Then the command `empty-trash` will be available to you. Running `empty-trash` will remove the contents of the `Trash/` directory completely.

## Conclusion

To recap, I'm running Ubuntu 20.04 inside of Windows Subsystem for Linux 2, and I use two tools to manage my trash can: `trash-cli` and `empty-trash-cli`. Here's a quick peak at my `.aliases` file to see what it looks like:

```shell
# .aliases

# Adds better handling for `rm` using trash-cli
# https://github.com/sindresorhus/trash-cli
# You can empty the trash using the empty-trash command
# https://github.com/sindresorhus/empty-trash-cli
alias rm='trash'
```

Just a few notes to myself so that future Jake will remember what the hell is going on. Ok, time to end this puppy. Bye :) 

