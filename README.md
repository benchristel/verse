# Verse

**Verse is a browser-based coding tool** that makes it
simple to create programs and games and share them with
others.

**Verse is designed with beginners in mind.**
It's a great way to start learning to code. But even
professional programmers will find it useful for sketching
ideas, performing [code katas](http://codekata.com/), or
bringing their side projects to life.

[Try it out!](https://verse.js.org)
Here's a simple program you can copy-paste to get started.

```javascript
define({
  *run() {
    let name = yield waitForInput("Hello! What's your name?")
    yield log('Nice to meet you, ' + name + '!')
    yield wait(1)
    yield retry(run())
  }
})
```

![A screenshot of Verse running a simple program](docs/screenshot.png)

## Downloads

In addition to [accessing Verse online](https://verse.js.org),
you can download past versions
[from the releases page](https://github.com/benchristel/verse/releases).
Just click the link for the `verse.html` file of the version
you want.

To use the file, open it in a web browser. On
most systems, you can double-click the file to open it.

Once you've downloaded a copy of Verse, you can use it
anywhere—even without an Internet connection!

## Documentation

You can find the
[**Verse Documentation**](https://benchristel.github.io/verse/docs/),
including "getting started" tutorials and a reference manual, [here](https://benchristel.github.io/verse/docs/).

## Guiding Principles

We value **simplicity, speed, beauty, and openness**.
The principles Verse uses to support these values are
described below.

- **Just Code.** Verse apps don't use HTML or CSS,
  so you only have to learn one language: JavaScript.
- **Immediate Feedback.** Many programming tools make you
  wait a lot—for programs to start, tests to run, webpages
  to load. This makes it harder to know whether the code you
  just wrote is going to work, and harder to debug when you
  have a problem. We believe the best amount of time to
  spend waiting is zero, and Verse gets as close as humanly
  possible to that goal.
- **Room to Grow.** It's easy to write toy programs in
  Verse, but it's just as easy to grow them into real,
  useful software. Verse is designed to scale seamlessly
  from 10 lines of code to 10,000.
- **Open Source.** The code powering Verse is free for
  anyone to inspect, use, and remix, and its history is
  saved on Github. Verse will always remain free for anyone
  to use. It will grow and change, but you'll always be able
  to use an older version of it if you really want to.
- **Private.** We take data privacy seriously.
  There's no sneaky code in Verse phoning home with data
  about you. Your code is stored only on *your*
  device, until you choose to share it with the world.
- **Works Offline.** Not everyone has access to fast
  Internet all the time. Once you've accessed the Verse site,
  it's stored on your device so you can use it even without
  an Internet connection.
- [**Non Nova, sed Nove.**](https://www.thebooksmugglers.com/2015/07/decoding-the-newbery-the-twenty-one-balloons-by-william-pene-du-bois.html)
  That's Latin for "not new things, but new ways." Verse
  doesn't try to make up new programming languages or
  syntax. The patterns you'll learn from using Verse are
  inspired by state-of-the-art programming tools like
  [React](https://reactjs.org/) and
  [Redux](https://redux.js.org/). Verse simply [**turns up
  the good**](http://developeronfire.com/podcast/episode-054-woody-zuill-turn-up-the-good)
  in these existing technologies. As a result, the things
  you learn from Verse will be useful for the rest of your
  programming career.

And, perhaps most importantly...

- **Fun.** Writing code and making stuff work should be fun.
  Verse aims to maximize the joy of programming while
  minimizing its frustrations.

---

# Technical Stuff

The rest of this document is intended for programmers who
work on the code for Verse itself.

## Contributing

### What to work on

Here are some areas where Verse could be improved:

- Refactoring, especially in the UI code
- Handling/reporting of errors, including
- Documentation

Changes to the API aren't likely to be accepted, even if
they're backwards-compatible. This is because I'm trying to
keep the API minimal.

Please add tests for your code if your change is not purely
UI-centric. This makes it much more likely that your pull
request will be accepted.

### How

To work on the code for **Verse itself**, do the following:

1. Fork and clone this repo.
1. Install [Yarn](https://yarnpkg.com/en/) if you don't have it yet.
1. Run `yarn` to install dependencies.
1. `yarn run start` to open a development version of the
  app in your browser (it will live-update as you change the code!)
1. In another terminal window, `yarn run test` to start the
  tests (they'll re-run automatically when you change code).
1. Commit your changes and submit a pull request.

## Forking

Verse is monolithic and lacks affordances for plugins.
That's by design. Verse is intended to provide a
self-contained programming experience that's consistent
across time, space, operating systems, and browsers.

Of course, there is no one-size-fits-all approach to
programming, and you will likely want to add things to Verse
that reflect your own philosophy. We encourage you to do
so by forking this repository and making whatever changes
you want.

Forking follows much the same process as [contributing](#contributing),
but instead of making a pull request for your changes, you'll
want to distribute your version of Verse. Here's how to
do that:

1. Run the `./build-standalone-html` script. This generates
   a `build/index.html` file.
1. Open `build/index.html` in a browser to make sure it works.
1. Share your `build/index.html` with the world. If you want
   to host it on the web, I recommend [GitHub Pages](https://pages.github.com/).

The [GNU General Public License](./LICENSE.md) requires you
to make source code available for any copies of Verse
(modified or unmodified) that you distribute. This can be
as simple as providing a link to your GitHub repository.

## License

Copyright © 2018, Ben Christel

Verse is distributed under the
[GNU General Public License, Version 3](./LICENSE.md).

This goes without saying, but to clarify: you may distribute
code you write *using* Verse under any license you choose.
Verse imposes no restrictions on what you can do with code
that you write. For more information, please see the
[license clarification](./LICENSE_CLARIFICATION.md).
