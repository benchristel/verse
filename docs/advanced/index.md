# What is Verse?

**[Verse](https://verse.js.org) is a browser-based
JavaScript development environment** that
makes it easy to grow quick sketches into
share-ready apps and games. It's currently in early-stage
development.

[Access the editor here!](https://verse.js.org) No sign-in
needed. Just click the link and start coding!

If you decide to give Verse a try, please let me know via
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
a line of code, and reversing those decisions later can be
costly. **Verse aims to remove as many of those
decision points as possible.** To achieve that, it provides
a **framework that scales smoothly from
no-UI one-liners to fully-featured interactive programs**.

If you're itching to make some *thing*,
but you don't know exactly what that thing will turn into, and
you don't mind writing the best JavaScript there is to make
it happen, Verse might work for you.

Here are some projects that would work great with Verse:

- [A script to generate wizard names](https://gist.github.com/benchristel/c47faab3b269d8dc45c78221e392553f) in the style of the Zork games
- A financial calculator
- A BASIC interpreter
- A Dwarf Fortress clone
- A Pokémon clone (once I get around to adding graphical capabilities...)
- A DM assistant for roleplaying games
- A contact-list database
- (If/when the [WebUSB proposal](https://wicg.github.io/webusb/) becomes a standard)
  an app that controls an Arduino to do... pretty much anything.

# Features

- Offline storage of your code and program state.
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

# Tutorial

Verse programs are built from functions, which all share
a single global namespace. Here's how functions are
defined in Verse:

```javascript
define({
  foo() {
    return bar()
  },

  bar() {
    return 'hello from bar'
  }
})
```

If you define a function named `displayText`, the return
value of that function is displayed on the screen.
The display updates whenever you change the code.

```javascript
define({
  displayText() {
    return [1, 2, 3].map(x => x * 2)
  }
})
```

## Procedural API

[Generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function%2A)
are the units of procedural code in
Verse. This documentation refers to them as *routines*.

If you define a routine named
`run`, it will be started when you click the "Run"
button.

```javascript
define({
  *run() {
    yield log('Hello, World!')
  }
})
```

Within a routine, you can `yield` special values to
cause side effects, like printing to the screen or
prompting the user for input. Verse refers to these values,
oddly enough, as "effects". They can be constructed via
functions in the Verse standard library as detailed below.

Available effects include:

- `yield log(message: String)`: prints the message to the screen.
- `yield waitForInput(prompt: String)`: displays a text prompt
  and waits for the user to press the `return` key before
  continuing. The return value of the `yield` is a string
  containing the text the user typed, excluding the final
  newline.
- `yield wait(seconds: Number)`: waits for the specified number
  of seconds before returning.
- `yield waitForChar()`: waits for the user to press a key before
  returning. Returns the `key` property of
  the `keydown` event, which in all supported browsers is
  equal to the character the user typed, or one of the following:

  - `Enter`
  - `Backspace`

- `yield retry()`: Restarts the current coroutine from the
  beginning. Does not return. Note that local variables get
  reset by a retry, since it actually invokes a new
  generator instance with a new scope.
- `yield (subroutine: GeneratorFunction)`: Runs the given routine
  until it returns. Returns whatever the subroutine returns.
  Note that this construct will not return if the subroutine
  `jump`s.
- `yield jump(routine: GeneratorFunction)`: Aborts the execution
  of the entire current call stack of routines, and starts
  the given routine as the new top-level routine.
- `yield startDisplay(view: function(state): Array(String))`:
  Registers the given function as the currently active view.
  The view function is called whenever a user interaction
  (like a keypress) occurs, and its return value is displayed
  on the screen, one array element per line. When the current
  routine returns, the view function is discarded and the
  previously active view is restored.

## Managing State

Most of a Verse program's state is maintained in a single
immutable object tree called "the state" (some temporary
state is usually held in local variables in routines). The
state can only be accessed (read or modified) by emitting
*actions* which are processed by *reducers* that create
an updated version of the state. If you're familiar with
Redux—it's almost exactly like Redux. To learn more about
the state/action/reducer concept, read [the Redux docs](https://redux.js.org/introduction/motivation).

An advantage of the immutable-state-tree model is that
actions are *transactional*. If a reducer throws an
exception while processing an action, the state is not
corrupted; any parts of the action that did succeed are
rolled back. You can create actions that affect
disparate parts of the state, and have confidence that
they'll never get out of sync.

One difference from Redux is that Verse introduces
mandatory runtime typechecking of the state. This guards
(if only partially) against the state being corrupted by
buggy reducers.

Here's a simple program that uses the state to count
keypresses:

```javascript
define({
  getStateType() {
    return isNumber
  },

  *run(update) {
    yield startDisplay(state => {
      return [
        `${state} keypresses so far`
      ]
    })
    yield waitForChar()
    update(tally())
    yield retry()
  },

  tally() {
    return {type: 'tally'}
  },

  reducer(count, action) {
    switch (action.type) {
      case 'tally':
        return count + 1
      default:
        return count
    }
  }
})
```
