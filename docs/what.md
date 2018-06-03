# Wherefore Art Thou, Verse?

**Tools**

- the design of tools and dev processes influences the design of code
- once your code has fossilized around a particular tool or process,
  using any other will be nearly unthinkable, and change will be painful
- choose tools and processes that are the ones you want to live with
- design code to work with those processes

Once I was in a planning meeting for a software project
where the programmers were talking about how to solve a
particular problem a customer was having. One of the
possible solutions involved writing some code to translate
some data from one format to another, but most of the
programmers were leaning away from that solution because
it was, in their minds, too complex and difficult to get
right. I didn't see what was so hard about it.
"It's just data transformation," I remarked. "If we use
test-driven development, it'll be easy. TDD is a perfect fit
for this kind of problem." They looked at me with surprise and a little incredulity.
**At that moment, I realized that the processes
and tools I was used to had profoundly changed
the way I approached programming problems.** These experienced,
highly-skilled programmers, most of whom were smarter than
me, were afraid of a problem that I thought was easy, and
it was because I had better tools for dealing with it.

**What process does Verse use?**

- TDD

**Truth to Materials**

**Precursors**

One of the experiences that caused me to believe something like
Verse might be possible happened because of another online tool
that I built, [Ji](https://benchristel.github.io/ji). Ji is
superficially similar to Verse: it has a code editor that
runs your code on every change, and it has a status bar
that changes color to tell you if your code works. However,
while Verse tries to be a comprehensive development
environment, Ji focuses on a tiny slice of the programming
experience: the rhythm of changing code and tests in a tight
feedback loop. This feedback loop is the core of test-driven
development. It's a truism that faster tests are better—the
less time you spend waiting to find out if your code works,
the quicker you can adjust if you got something wrong. When
tests take minutes to run, or even 30 seconds, it's all too
easy to get distracted or forget what the next thing you
were going to do was. You tend to write more code before
each run of the tests—the tests take so long that running
them after every tiny change feels like a huge waste of
time.

Despite the obvious benefits of fast tests, I've received
a surprising amount of pushback from other developers when
I advocate for extreme levels of test speed. Most
programmers feel good if their tests only take a few seconds
to run, and many are fine with compile/test cycles that take
*minutes*. These are often the same programmers who say things
like this:

*Design of code isn't as important as performance.*

*Users don't care if your code is pretty, but they'll make a
stink if things are slow.*

It boggles my mind when programmers who demand
fast code put up with slow tests. They'll go through ridiculous
contortions to shave off a few nanoseconds (often where it
doesn't even matter) but then wait *minutes* for the build
to run. It's as if they value the
computer's time more than their own, which, if true, would
be absurd.

I think they probably aren't thinking of the tradeoff in
those terms, though. It's more likely that their experience
with slow compile/test cycles has reinforced their inborn
human intuition that computers *can't possibly be that fast*.

I remember the first time I had my own intuition on this
point challenged: I was writing a tic-tac-toe game in
Visual Basic, with a simple AI that would find a winning
move if there was one, and block the human player from winning
otherwise. The code was at the limits of my abilities, and
when I ran the program I expected that when I made a move,
the computer would chew over my complicated algorithm for
at least a fraction of a second before making its response.

What actually happened was that there was *no* delay between
my move and the computer's. The answering move appeared
*simultaneously* with my own.

My first thought was that I must have introduced a bug
somewhere, and accidentally printed an extra "O" when I only
meant to print an "X". There was *no way* the computer could
be running all that code that fast. I mean, it took me a
day to write it, and another day to debug it! And the
computer had the nerve, the *gall*, to act like it was
nothing more than a trifle!

I checked over my code again. With a sigh, I admitted to
myself that yes, it really was that fast. And then I added
a timer that would delay for a second before outputting the
computer's move.

We humans retain a neolithic fascination for
monumental constructions. [We think slow means big, and big
means sturdy](https://www.webdesignerdepot.com/2017/09/when-slower-ux-is-better-ux/).
If the tests are slow, that is just a sign
that we have created something grand and complicated and
enduring. I've felt the thrill of this myself. For the first
few runs of a slow test suite, one can delight in imagining
the whirring machinery one has created; one can practically
see it move. But that thrill is mere vanity, and the
slowness a sign that we are just wasting processor cycles on
a machine that is really orders of magnitude faster than
anything our carbon-based minds can perceive or comprehend.

The way I like to explain it to people is: a computer
takes roughly a nanosecond to add two numbers together. In
that amount of time, light travels *one foot*. The
computer can do the calculation in less time than it takes
the light bearing the result to travel from the screen to
your face. And once the light gets to your face,
it takes about a hundred milliseconds—that's a hundred
*million* nanoseconds—for your brain
to notice it. (Brains are complicated so this number is
a bit fudgey; suffice it to say that if the
computer took 100 milliseconds instead of one nanosecond to
respond to you, you wouldn't really notice the difference.)

So performance matters, but only to a point.
In most cases, the amount of performance that
can be gained by optimizing an algorithm is not worth the
cost in programming time. "Stupider" methods, like
memoization, caching, and throttling, are often perfectly
sufficient to solve the performance problems that actually
impact the users of the software.

So, back to Ji: I set out to prove that fast tests are
indeed possible, and even valuable. How fast is fast?
Fast enough that *faster* isn't valuable anymore. In other
words, below the hundred-million-nanosecond threshold of
noticeability.

If we can write tests that run in a hundred milliseconds,
they can run *on every keystroke*. Every time code changes in
the editor, even by one character, the tests can run and
tell the programmer whether the code works before she or he
has time to think or even type another character.

You may think this is silly, or perhaps a form of senseless
extremism. It certainly isn't immediately obvious why a
hundred-millisecond test suite is better than a
three-second test suite. Both constitute a subjectively
"fast" feedback loop. So there shouldn't be much difference
between them, right?

Wrong. There is a massive difference between *instantaneous* and merely
*fast*. Without instantaneous feedback, singers would hit wrong notes.
Dancers couldn't dance. Athletes would stumble. [Public speakers
would stutter and fall silent](https://www.technologyreview.com/s/427116/how-to-build-a-speech-jamming-gun/).
Perhaps you think that coding is not like these other
disciplines—that the requirement for sequential logical
thought makes coding fundamentally different from an art or a
sport where virtuosity entails acting and reacting in real
time. I contend that is *is* like them—or can be, at least.

Our existing programming environments hint at what this type
of virtuosic coding might someday be like. For instance, in most
editors, syntax highlighting is instantaneous. If you choose
a variable name that collides with a keyword, or you leave a
string unterminated, you know immediately, and can
course-correct. You don't have to
wait to get a compilation error and then track down your
mistake by line number and column. For all intents and
purposes, syntax highlighting completely eliminates the
types of errors that can be caught by tokenizing a program.

Syntax validation, on the other hand, is not yet
instantaneous, and the visual feedback most editors provide
for syntax errors is not sufficiently precise for me to
understand exactly where the problem is without reading the
error message. Because the feedback is not instantaneous,
syntax validation can't be said to *eliminate* the errors
it detects—it merely catches them and prevents them from
propagating. However, I can imagine that, with the right
programming environment, parsing errors might be caught and
recovered from as quickly as tokenization errors.

Going beyond syntax validation, the next level of checking
for a program is semantic validation. This is performed by
the type system (in statically typed languages) and by
unit tests. Many editors display type errors inline without
being prompted to do so, but no editor that I know of runs
unit tests at the same time. This seems like a strange
omission since types and tests serve largely the same
purpose, but there's an obvious reason for it:
the creators of editors assume that unit tests will
be slow—far too slow to run on every change to the code.
Editors treat tests as second-class citizens
because *developers* treat tests as second-class citizens—and
of course, the developers persist in this approach because
their editors enable them to.

But viewing unit tests as just the next level of checking
beyond syntax highlighting and parsing

- tests are an extension of the development environment:
  a custom semantic check that our editor can use to tell
  us where we screwed up.


feedback must be
- immediate
- involuntary



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
- **Verse makes it harder to collaborate on code with a team.**
  You *can* put Verse code in a Git repo, but it's slightly
  awkward since Verse is browser-only.

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
