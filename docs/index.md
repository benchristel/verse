# Welcome!

**Verse is an online programming tool** that makes it easy to
create simple programs and games. In the future, you'll
be able to share your programs and remix others' work, too.

**Verse is designed with beginners in mind.** It's a great way
to start learning to code. But even professional programmers
will find it useful for quickly sketching ideas or bringing
their side projects to life.

[**Try it out!**](https://verse.js.org) No need to create
an account or log in. Just click the link and start coding.
Here's a simple program you can copy-paste to get started.

```javascript
define({
  *run() {
    let name = yield waitForInput("Hello! What's your name?")
    yield log('Nice to meet you, ' + name + '!')
    yield wait(1)
    yield retry()
  }
})
```

Once you're ready for more, you can continue reading the
Verse documentation here... but first, tell us a bit about
your programming experience.

- [I'm new to programming!](./beginner/)
- [I know how to program but I don't know JavaScript.](./intermediate/)
- [I already know JavaScript.](./advanced/)
- [There are things I wish I *didn't* know about JavaScript.](./advanced/)
