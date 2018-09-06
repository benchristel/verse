# FAQ

Frequently-answered questions about the Verse platform:

## Can I run a background routine in a separate "thread" (like in redux-saga)

No, and this feature is unlikely to be added in the future.
Here's why:

The main reason why you'd want to start a background thread
is to introduce a delay before something happens. For
instance, your game might have an area where if the player
steps on a trap, a timer starts, and if the player doesn't
finish the level within 30 seconds a bomb goes off and they
lose.

Now, consider what happens if the player *saves the game*
while the timer is ticking.

If you implement the timer using a background routine,
saving and restoring the game with the correct state becomes
very difficult. The timer countdown is locked away in the
JavaScript VM, where you can't get to it.

If, on the other hand, you put the timer state in Verse's
`state` object, and `perform` an action every frame to
decrement it, saving the game "just works".

## Why can't it do X? (or, why is there no library function for X?)

It's possible that I just haven't gotten to it yet. Some
things are higher priority than others, and I can only work
on one thing at a time. However, it's also possible that
I have intentionally decided not to include a given feature
in Verse.

Here are the criteria I use when deciding whether a feature
should be part of Verse:

- It needs to be **necessary**. There should not be an easy
  way of doing the same thing by assembling the existing
  building-blocks. Sure, it would be nice to have
  a purpose-built library function for every conceivable use
  case, but at some point it takes longer to find the
  function you want in the documentation and learn how to
  use it than it would to just write it from scratch.

- It needs to be **useful**. A lot of times I ask myself
  "but what if someone wants to do XYZ?" and I have to
  remind myself that quite possibly no one will want to do
  that. If I can't think of an application that really needs
  the feature, I won't add it (until someone brings such
  an application to my attention).

Once I've decided that there's a pressing need for Verse to
do thing X, I then have to decide how it does that. Often
this means designing a built-in function that programs can
use.

Since Verse is designed with beginners in mind, the function
must have no moving parts that appear to be extraneous when
viewed from the simplest use case. Extra "magic" arguments,
complex return values, convoluted semantics—all these are
roadblocks for the novice who just wants to do a very basic
thing.

However, Verse is also designed with experts in mind,
which means that the programming interface must not cause
maintenance problems as applications grow in complexity,
*even if the interface is used naïvely*. It's always
possible for a skilled programmer to build a better
interface on top of a clunky one, but the
purpose of Verse is to make it so they don't have to.
Or, to put it another way—the interface should
make good design easy, and maybe even inevitable.

> *"Everything should be made as simple as possible, but no
simpler."* —variously attributed

Programming interfaces also need to be
testable. Eminently testable code is a joy to test,
producing a positive feedback loop of good design, good
vibes, and confidence that the code actually works.
Interfaces that make testing painful or awkward discourage
testing and diminish its value.
