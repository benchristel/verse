# What is Verse?

**[Verse](https://verse.js.org) is an all-in-one
programming environment** that lets you **write and run
JavaScript in your web browser**. Verse
makes it easy to grow quick sketches into
share-ready apps and games. It's currently in early-stage
development.

If you decide to try it out, please let me know via
[@VerseCode on Facebook](https://www.facebook.com/VerseCode/)
how your experience could be improved. I want Verse to
be **the absolute easiest way to turn ideas into working
software,** full stop. If it falls short of that goal in any
way, let me know and I'll work to make it better. (Please do
keep in mind that it's nowhere close to fully baked yet, so
before you write me a 500-word message on why it needs
feature X, check with me to see if it's on the roadmap—quite
possibly I just haven't gotten to it yet.)

## Support for Breaking Changes

Verse is still in alpha-stage development, which means that
some of the APIs you can use today may undergo breaking
changes in future versions. **I will assist in the upgrade
of any program under 32kb of JavaScript that is broken by a
change to Verse**. Just message
[@VerseCode on Facebook](https://www.facebook.com/VerseCode/)
and we'll figure out how to collaborate on your code.

# Why Use Verse?

Starting a new side project—even if it's a tiny, one-off tool—can
feel like you're wading through a miasma of small yet
important decisions.
*What should I name the Github repo? Do I need a GUI? What language am I going to use?
Do I need a framework? What about unit tests? Am I
going to use a module loader, or can I get away with
inlining everything in one HTML file?*
In effect, traditional tools force you to decide on the
scale and architecture of your project before you've written
a line of code. **Verse aims to remove as many of those
decision points as possible.** To achieve that, it provides
a **framework that scales smoothly from
no-UI one-liners to fully-featured interactive programs**.

If you're itching to make some *thing*,
but you don't know exactly what that thing will turn into, and
you don't mind writing the best JavaScript there is to make
it happen, Verse might work for you.

# Features

- Support for both imperative and functional programming,
  with a clean separation between the two as described in
  [Gary Bernhardt's excellent talk "Boundaries"](https://www.destroyallsoftware.com/talks/boundaries).
  Imperative programming in Verse uses [generator-based coroutines](https://www.wptutor.io/web/js/generators-coroutines-async-javascript)
  that look like this:

  ```javascript
  *run() {
    let name = yield waitForInput("What's your name?")
    yield wait(1)
    yield log(`Hello, ${name}!`)
  }
  ```

  Verse is designed so that **stateful and side-effecting code
  *must* go in generator coroutines**. Coroutines
  can call normal functions but not vice-versa, so it is
  impossible for
  side effects to infect a component that looks like a pure
  function.

- A [model-view-update architecture](https://guide.elm-lang.org/architecture/)
  inspired by [Elm](http://elm-lang.org/) and [Redux](https://redux.js.org/).
- Immediate hot-swapping of your program's code as you
  change it, enabling the fastest feedback loop imaginable.
  Seriously. The only way to make it faster is to drink
  more coffee.
- **[UNDER CONSTRUCTION]** A lightning-fast unit test
  framework with [minimal syntax](https://benchristel.github.io/blog/2018/04/20/es6-methods-and-the-verse-test-framework/):

  ```javascript
  'test addition'() {
    expect(2 + 2, is, 4)
  }
  ```

# Why *Not* Use Verse?

If you're thinking of using Verse for your next project,
you should understand that it makes some extremely harsh
tradeoffs. Verse's stance is that *everything* inessential
to the creation of working software can and must be
sacrificed in the name of streamlining the development
experience. In particular, that means UI gloss goes
out the window. For better or for worse, you're not gonna
be writing any CSS in a Verse project. If that sounds
more frustrating than liberating, Verse is probably not
going to work for you.

Here are some other reasons you might not
want to use Verse:

- **You can't access the DOM**. Verse doesn't let you craft
  your own HTML.
  Right now, it can make text-only terminal-UI style apps,
  and eventually it will let you draw stuff on a `<canvas>`,
  too. But if you need an `<input type="date">`... yikes.
  Use something else.
- **You can't install NPM packages.** "Installing" a
  dependency in Verse means copy-pasting it into your
  source code. Verse aims to provide a comprehensive
  "standard library"
  of basic utilities, but if you need more specialized tools
  it's going to be a bit painful to get them into your
  program.

As Verse matures, I expect some of these constraints will be
relaxed, worked around, or reversed. But don't hold your
breath.

# Comparison to Similar Tools

Verse is both a programming environment (including an editor,
test runner, and app UI viewer) and an application
framework. This sets it apart from tools like CodePen and
JSFiddle, which provide a similar online editing experience
but have no opinions about how code is structured, and from
libraries like React and Redux, which have no opinions about
development workflow. The closest comparison might be to
something like [Elm Reactor](https://github.com/elm-lang/elm-reactor),
though Verse enables significantly faster feedback loops
than Elm since JavaScript does not have to go through a
time-consuming compilation step before it runs. Additionally,
Elm Reactor requires you to be on a Unix-like system where
you can install and run command-line programs, while Verse
requires only a web browser.
