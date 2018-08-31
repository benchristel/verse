# Welcome!

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

![A screenshot of Verse running a simple program](screenshot.png)

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

## Legal Stuff

By using Verse, you agree to our [Terms of Service](./tos).
We know you won't read them, so here's the TL;DR:

- Be kind.
- Don't sue us.

Have fun!
