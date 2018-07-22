# Welcome!

**Verse is an online coding tool** that makes it easy to
create programs and games using JavaScript, the
programming language of the Web.

**Verse is designed with beginners in mind.** It's a great way
to [start learning to code](./beginner/). But even professional programmers
will find it useful for quickly sketching ideas or bringing
their side projects to life.

![A screenshot of Verse running a simple program](screenshot.png)

## Getting Started

[**Try it out!**](https://verse.js.org) No need to create
an account or log in. Just click the link and start coding.
Here's a simple program you can copy-paste to get started:

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

## Tutorials

There are several tutorials available for Verse, linked
below. Pick the one that best suits your level of
programming experience.

- [Learn to Code with Verse](./beginner/) _—for complete beginners_
- [Rapid App Development with JavaScript and Verse](./intermediate/) _—for programmers who don't yet know JavaScript_
- [The Tao of Verse](./advanced/) _—for JavaScript experts_

## Inside Verse

Verse's unorthodox design deserves some explanation. In
these articles I explain why I made Verse, and the
technical and psychological constraints that led to its
current design.

- [Verse: Why? What? How?](./articles/what-why-how) _—On philosophy and its practical application_
- [The Verse Design Diary](./articles/design-diary) _—Mistakes were made (probably)_
- [Verse Is Worse Than Useless](./articles/worse) _—All the criticisms in one place. Instead of writing your own scathing review, you can just link here_
- [Frequently-answered questions](./faq)

## Reference

You ~~can find~~ will eventually be able to find a complete
guide to all of Verse's built-in functions within the editor
itself. Until then, please refer to
[the Function Reference](./reference/functions).

For general information about JavaScript, the
[Mozilla Developer Network site](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
is an excellent resource.

## Legal Stuff

By using Verse, you agree to our [Terms of Service](./tos).
We know you won't read them, so here's the TL;DR:

- Be kind.
- Don't sue us.

Have fun!
