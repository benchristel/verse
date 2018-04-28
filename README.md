# Verse

Verse is an online programming tool that makes it easy to
create simple programs and games. In the future, you'll
be able to share your programs and remix others' work, too.

Verse is designed with beginners in mind. It's a great way
to start learning to code. But even professional programmers
will find it useful for quickly sketching ideas or bringing
their side projects to life.

[Try it out!](https://druidic.github.io) No need to create
an account or log in. Just click the link and start coding.
Here's a simple program you can copy-paste to get started.

```javascript
define({
    *init() {
        let intro = "Hello! What's your name?"
        let name = yield waitForInput(intro)
        yield log('Nice to meet you, ' + name + '!')
        yield wait(1)
        yield retry()
    }
})
```

## Guiding Principles

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
  anyone to inspect, use and remix, and its history is
  saved on Github. Verse will always remain free for anyone
  to use. It will grow and change, but you'll always be able
  to use an older version of it if you really want to.
- **Private.** We take data privacy seriously.
  There's no sneaky code in Verse phoning home with data
  about you. Your code is stored only on *your*
  device, until you choose to share it with the world.
- **Offline First.** We know not everyone has access to fast
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

## Contributing

To work on the code for **Verse itself**, do the following:

1. Fork and clone this repo.
1. Install [Yarn](https://yarnpkg.com/en/) if you don't have it yet.
1. Run `yarn` to install dependencies.
1. `yarn run start` to open a development version of the
  app in your browser (it will live-update as you change the code!)
1. In another terminal window, `yarn run test` to start the
  tests (they'll re-run automatically when you change code).
1. Commit your changes and submit a pull request.
