# The Verse Rant: What? Why? How?

> I have been a multitude of shapes,
> Before I assumed a consistent form.
> I have been a sword, narrow, variegated,
> I have been a tear in the air,
> I have been in the dullest of stars.
> I have been a word among letters,
> I have been a book in the origin.
>
> —Taliesin, sixth century C.E.

> _Non Nova Sed Nove._ Not new things, but new ways.
> —The inhabitants of Krakatoa, _The Twenty-One Balloons_, William Pène du Bois

The ideas behind Verse are not new. There is nothing innovative about its
implementation, and the language of its programming interface is plain
old JavaScript. Its concept—the idea of an opinionated,
integrated development environment with a complementary
programming language, library, and suggested methodology—[has](https://en.wikipedia.org/wiki/ABAP)
[recurred](https://en.wikipedia.org/wiki/Smalltalk)
[throughout](https://en.wikipedia.org/wiki/Visual_Basic)
the history of computing.

In spite of this, I think Verse manages to put these old
things and ideas in a new light. In this essay, I hope to
clarify where Verse comes from, what it does differently,
and why. I will touch on origins, inspirations, history, and
implementation. To motivate the ideas I present, I will
focus mainly on specific experiences from my own programming
career, though as Verse is a general system, I will try to
generalize those experiences into principles.

## Precursors

People have been trying for a long time to reinvent software
development. Think of Unix, Smalltalk, Visual Basic, and Android.
Each of these systems tried to reimagine the tools and patterns
we use to create software.

Verse also resides in this category.
What makes it different from its predecessors is its
focus on testability. Verse is designed to support fast,
granular automated tests, often to the exclusion of other
features. This will likely be controversial; unit testing
seems to have as many vocal detractors as supporters.
I think a lot of the people who criticize unit testing do so, quite reasonably, because they've had bad experiences with it, and those bad experiences have led them to assume that unit testing can never be done well. As someone who has had many good experiences with
unit testing (as well as my share of bad ones), I contend
that it *can* be done well—but that our existing tools and
libraries are standing in our way.

You don't need to take my word for it, though: just read
David Heinemeier Hansson's posts ["TDD is dead. Long live testing"](http://david.heinemeierhansson.com/2014/tdd-is-dead-long-live-testing.html)
and [Test-induced design damage](http://david.heinemeierhansson.com/2014/test-induced-design-damage.html)
and you'll see what I'm talking about.

David (or DHH) is the creator of Ruby on Rails, a framework for building web applications. The examples he gives in those articles refer to Rails, and it's probably safe to assume that a large percentage of the code he writes and tests is Rails code. With that in mind, let's go over the examples he gives of why TDD and unit testing are ineffective:

- you end up with "an overly complex web of intermediary objects" which exist only to "avoid doing anything that's 'slow'," such as IO. [the unspoken assumption here is that these intermediary objects are the only way to isolate your business logic from IO]
- "unit testing" in "the traditional sense of the word" means "all dependencies are mocked out" [this is pure nonsense; it is neither "traditional" nor necessary to use mocks to isolate the code under test. Again, the unspoken assumption is that mocks are the only way to isolate the component under test.]

Now, I'd like to pose the following (mostly rhetorical) question: is DHH's dislike of TDD and "unit tests" due to flaws in TDD _per se_, or to the design of Rails being incompatible with TDD?

All of DHH's criticisms boil down to this:

- Rails makes it hard to write units of code that are both simple/readable and testable in isolation.
- Rails is good.
- Simple, readable code is good.
- Therefore, unit testing is bad.

Now, this is kind of silly. There is no *a priori* reason why
code can't be simple, readable, *and* testable. But because
DHH is so invested in Rails, he (probably subconsciously)
sees this have-your-cake-and-eat-it scenario as a threat. If
it's really possible, it means he has a lot of design rework
to do. So of course he's resistant to seeing that it *is*
possible. Anyone would be.

It's worth noting that DHH's perspective is not really
*wrong*, when you take the design of Rails as a given.
Rails testing is a trilemma, and therefore there
are two other perspectives on it that are equally valid:

- Rails is good; unit testing is good; therefore simple code is bad.
- Unit testing is good; simple code is good; therefore Rails is bad.

In summary: Rails, unit testing, simple code: pick two.

Though all of these are logical perspectives, the third
("Rails is bad") is perhaps the most pragmatic. We cannot
reduce our need to comprehend and test our code as easily
as we can switch web frameworks. Of course, the pragmatism
of this perspective hinges
on whether is some alternative that lends itself better to
testing and simplicity than Rails does. So far I haven't
seen such an alternative.

All of this is a bit of a digression: Verse is not a
replacement for Rails, and really has nothing to do with Rails;
I picked on DHH's posts simply because they're well-written,
relatively (in)famous criticisms of unit testing. But the
testing/simplicity trilemma is not solely about Rails. It applies to
any technology not designed explicitly to support simple,
testable code.

## Words

- software dev is a game of telephone - we can't understand each other because we don't agree on what our words mean.
- OO, TDD, Agile (dear god, Agile), testing pyramid, user story, velocity, bug
- a lot of energy is wasted debating semantics
- a lot of good points go unregarded because someone isn't using terms "right"
- arguments from authority
- I'm not going to use any of those words in this essay. As much as I can,
  I'm going to try to explain what I mean in concrete terms, with examples,
  if appropriate.

## Misalignment

- The primary users of software are no longer the ones paying for it—software companies aim to shape usage patterns (for their own profit) rather than be shaped by them (for users' benefit).
- data processing is tied to data transfer in many products—again to the benefit of companies rather than people. E.g. Facebook's recommendation engine is tied to Facebook's content delivery platform.
- Jim Coplien laments that OO and Agile are no longer user-centered. Well, of course they're not! The products aren't being made for the users! The user doesn't even have a mental model to translate into code.
Users of consumer products don't start with an idea of a workflow and then expect to see that translated into code. They take cues about what the solution entails, and even about what the problem is, from the software. Cope says that the software is insidiously forcing its model on the user, but what's the alternative when the user doesn't have a mental model to begin with? He's working from a model of software that extends the user's real-world concepts, goals, and intentions, but more and more software products these days have no bearing on anything real-world.
- the strategy of many software companies is to capture users with network effects
- or carve out their own piece of an existing market that's serving users just fine
- or "disrupt" some existing industry so they can siphon off money that was previously going to middle-class wage earners *cough cough Uber*
- "I use my smartphone too much but I can't stop because people expect to be able to contact me through WhatsApp and Messenger" - social pressure to keep using proprietary tech
- normalized to the extent that smart people are saying that "not everyone should code" because "real programming is AI and blockchain and consensus algorithms, not this if-then-else-loop babytalk." It's notable that all of that stuff is accidental complexity according to Moseley and Marks, because it's implementation details that have no place in the end-user's mental model. If the only "real programming" is stuff that makes money at the expense of end users, then I don't want people to be "real programmers".

Solutions?
- the users should own the means of (software) production—either by producing software themselves, or (less likely) working with the people who produce software and writing their paychecks.
- separate data transfer from logic. Verse is the logic platform; other people are working on the data problem (webtorrent, upspin, others?)
- rethink UI paradigms so users have a consistent mental
  framework for interacting with computers. (Verse does
  this, and hopefully will some day do it well)

## Obligation

- Obligation (actual or perceived) stresses people out
- mostly when they're not addressing the obligation
- imagined obligations can never be fulfilled. Since there is
  no one but yourself obliging you to do the thing, you
  can get no feedback at all about whether you are "good
  enough"
- imposter syndrome
- DHH: "TDD dogma is like abstinence-only sex ed"
- a TODO list is a false promise.
- TODOs let you say "oh yeah, I know about that problem It's on my todo list. I don't need to fix it right now,
I'll get to it eventually"
- putting something on a TODO list feels like you've addressed the problem but it's really just adding to your list of obligations
- but by putting the thing on the TODO list, you've already proven that you can identify the problem. If you can do that, what's stopping you from forgetting about it until it becomes an actual need? If it's really important, it will assert itself later.
- This breaks down when tasks that can become urgent take a long time and therefore have to be scheduled in advance.
  I'm not going to wait to do laundry until I'm getting ready to leave for work and realize I don't have any clean clothes; at that point it's too late. So what do you do with laundry? You *schedule* it. And that's why we have XP and Scrum and Kanban and Waterfall and whatever next big thing will probably replace them in five years. To deal with this scheduling problem. The scheduling problem goes away if you work in very short cycles so you don't have to juggle and schedule your obligations.
- If the cycle time for fixing and testing a problem is long, one feels the need to catalog all issues upfront. If an important issue gets missed—oops, you have to wait a whole cycle before you can stop the bleeding.
- of course, this no-obligations way of coding only works if you're addressing a need. If you're solving a real problem, users will put up with underfeatured, slightly buggy software. They'll ask you to fix problems, of course, but that's fine—you can fix them. In the meantime you've made their lives incrementally better with just a half-baked implementation. If you're *not* solving a real problem, your customer is not your users; it's whatever entity is trying to manipulate the users for its own gain. And these entities, in my experience, demand perfection, because either a) the user experience must be so seamless and slick that users don't notice that it's not for their benefit, or b) the company is trying to compete in a market that's already addressing the users' needs and so if they don't have all the features the other products have they won't be able to sell anything.
- A backlog or "bug tracker" is just a list of ways that you are failing or have already failed. It is guaranteed to make you unhappy and burn you out. Especially since, on all of the projects I have worked on, issues go into the issue tracker and just *sit there*. They *never* become the top priority; they're constantly getting pre-empted by other things. Jim Coplien: "We put our bugs in Jira. No one will ever find them there!"
- Deliver to users when what you have will make their lives just a little bit easier. Listen to their feedback and either incorporate it immediately or make a conscious choice to do nothing because you don't have enough information yet. If the issue is worth addressing, it will come up again. If not, you'll never have to think about it.
If this process doesn't make sense for the software you're trying to build, **don't build it**.
- Know when to rewrite. A first attempt at a product is often just a learning experience. Constantly reacting to the most recent requests from users can create a lot of "scar tissue" and haphazard design in a codebase, and sometimes you will find that the design that has evolved doesn't correspond to the user's mental model all that well. A rewrite does not mean you have failed. This does not mean you should "plan to throw one away" and write crappy code. Write code that's general enough to be reused, and cleanly separated from the parts you're most likely to throw away.

## Feedback

- Others have described the benefits of fast feedback
  - https://www.destroyallsoftware.com/blog/2014/tdd-straw-men-and-rhetoric
  - http://blog.cleancoder.com/uncle-bob/2016/05/21/BlueNoYellow.html
  - Fast test, slow test
- The most immediate feedback our editors give us is syntax highlighting.
- Next is syntax checking.
- Next is semantic checking (via types) (assuming our language has static types)
- Finally, tests (assuming we write tests)

When feedback happens instantaneously, in the editor, it can
eliminate whole classes of errors. If you have a good syntax highlighter
(and understand which colors mean what) you will never choose a variable name that
collides with a keyword. If you have a good syntax checker, you
will never try to compile or run syntactically invalid code.
If you have good tests, there are certain types of bugs that
will not exist in your program.

The best editors check tokenization, syntax, and types in
real time as you change code. They generally do not run
tests in real time, though. The big reason is that editors
cannot guarantee or even assume that tests will run quickly.

As a programmer, one of the hardest things is to say "yes,
it's not perfect yet, but we'll get there." There's a
temptation, when the existing code isn't clean or doesn't
accommodate the next change nicely, to just rip everything
out and do a big-bang refactor. It takes patience and
courage to acknowledge the problem, commit to solving it,
but not try to do everything right away.

## Beginning

I started programming at the age of eight. I was able to do
so not because I was particularly talented (it took me way
longer than I like to admit to grok arrays and loops), but
because the language I learned first was Visual Basic 6, and
VB6 is an astonishingly easy language to get started in.
It had a WYSIWYG editor that let
you drag buttons and other controls onto your program's UI
and arrange them however you wanted. Double-clicking one of
those controls brought up a code editor where you could fill
in the implementations of various event handlers. Then you
clicked the "Run" button. And the program ran.

The abstraction presented by the Visual Studio IDE was so
complete that I never had to think about things like which
"files" my code was in. I don't even know, *to this day,* if
VB6 stored its source code modules in separate files on the
filesystem, or if the entire project was packed into a
single blob using some godawful proprietary flavor of XML.
When I was eight years old I wasn't even sure what a file
was, let alone a compiler, operating system, or shell. And
yet, I was able to create programs—as time went on, quite
sophisticated programs—without *really knowing* how computers
worked.

That abstraction was perhaps *the* main reason I was able to
start programming so young and willing to keep programming
as I got older. Had I started with any of the
other languages available at the time, I would have had a
much rougher experience. Makefiles? C compilers? No way
would I have gone anywhere near that stuff as a kid. The
sight of a Makefile still fills me with dread, in part
because Visual Basic taught me the irrevocable lesson that
programming *should not be that hard*.

However, as I look back on Visual Basic after nearly a
decade programming in "better" languages, the thing I find
most amazing about it is that despite being simple enough
for a fourth-grader to pick up, *it was not a toy*. VB6 was
designed as a tool for Serious Business People, albeit ones
without much software development expertise, and because of
that it stayed relevant to me for nearly a decade as I
attempted ever more ambitious projects. My first program was
a button that turned blue when you clicked it. The last
program I wrote in VB, in my junior year of high school, was
a Guitar Hero clone complete with faux-3D graphics and a
level editor. And there was no cliff of difficulty along the
way where I suddenly had to
learn a new toolset or a bunch of advanced programming
concepts. I just kept writing code the way
I always had, and with each new project I attempted my
programs got bigger and better.

[Modern](https://www.khanacademy.org/computing/computer-programming/programming)
[tools](https://scratch.mit.edu/)
aimed at novice programmers generally aren't like this. They
present a sanitized, simplistic view of programming that
works okay for toy problems but doesn't scale with the
student's ambitions. I mean, just look at [the comments
section on the final chapter of the Khan Academy programming
course](https://www.khanacademy.org/computing/computer-programming/programming/good-practices/a/good-practices-what-to-learn-next)—it's heartbreaking. Students who have mastered the
basics of JavaScript and are hungry for more are being told they can't
keep using the toolset they've just learned, because their
"tools" are really just toys that only exist within Khan
Academy's tidy sandbox. They'll have to buckle down,
get a four-year degree, and learn "real programming" if they
want to keep going with their newfound passion.

That's shameful, and we can do better.

## Fear

Although I was able to do quite a lot with Visual Basic,
there were some dreams I dared not chase. For instance, I
planned a
simulation game that would involve growing, harvestable
plants, wandering beasts, and constructable shelters
(essentially, I wanted to make Minecraft, but this was years
before Minecraft) but the implementation never got very far, because I didn't
understand how to create data structures that would let me
render the world and keep track of the simulation
efficiently. I knew *in theory* how it could work, mind
you—I just had no clue how to translate that theory into
code in a way that wouldn't be hideously complex. I had no
understanding of object orientation or
any data structures other than fixed-length arrays. So
whenever I tried to plan out how I was going to create this
game I got bogged down in details. I did not know how to
create abstractions, so the only way I could program was
by trying to fit the entire system in my head. I knew that
I could not do this; I had learned through hard experience
to fear complexity, but I had no idea how to manage
complexity.

Certainly my lack of CS knowledge was holding me back, but I
think the design of Visual Basic was also partly to blame.
Nothing about the language or its libraries hinted at how to
structure complex programs. The good thing about Visual
Basic was that it made imperative programming and
controlling a GUI incredibly easy. The bad thing about
Visual Basic was that it made me think that *that was all
there was to programming*. Not only did I not know what
questions to ask, I didn't even know that I had questions.
I thought programming was just syntax, so I learned syntax
until I had a Turing-complete subset of the language, and
then I applied that subset to every problem I encountered.
The idea that there were multiple ways to design the
internals of a piece of software, and that some designs were
better than others, never occurred to me.

## Design

I eventually learned the error of my ways, of course—though
I was in my senior year of college before I fully grasped
that program design was something I might want to pay
attention to. Over the next couple of years, as I graduated
into an internship and then my first full-time job, I came
to accept that not only was design important, I still had
a lot to learn about it. At times it seemed unfathomably
difficult, a dark art with no clear rules. I carved up my
code into classes and methods, and sometimes it made things
easier and sometimes it made them harder. I concluded that
design was something that had to be done by intuition, and
that intuition was something that could only be gained
through years of experience.



## Tools

I once worked on a greenfield C++ project where we used
an underscore to mark member variables. I asked our local
C++ guru why we were doing this, since after all our IDEs
highlighted member variables in a way that was clearly
distinct from local variables. He pointed out that not
everyone in the company used our IDE so they might not be
able to rely on code highlighting.

It was just a tiny thing, but this is a concrete example
of how the tools used to develop code shape that code.
What's true of tools is also true of process: e.g. if you
use TDD to develop
code, you may not be able to understand or safely work with
that code without tests. The design of the code may not make
sense, or certain classes may seem too abstract, if you
don't consider that they were test-driven (what DHH called
test-induced design damage). Conversely, if you don't use
TDD, it may be impossible to introduce unit tests later when
you find you need them.
The process used shapes the code. The code cannot be
separated from its process without harming it.

Like it or not, tools and processes are part of the codebase.
As X pointed out, it almost doesn't matter what process you
use, so long as there is a process and it is applied
consistently.

And yet, we have software organizations where every
developer uses a different editor. Or the same editor with
different plugins. Or a different style of testing. Or a
different debugging technique. Or they set their terminal at
a different width, or...

What inevitably happens is the codebase reinforces these
silos where only the people, processes, and tools that
originated a piece of code can work with it effectively.
You end up with a tower of babel situation where people from
different teams, or even people on the same team, can't
communicate effectively about what they're doing. When
communication does happen, there may be vehement
disagreements (emacs vs. vim, anyone?).

The problem is exacerbated when we talk about process and
design because people don't all use words to mean the same
thing. If I use a deceptively simple term like "unit test"
or "refactoring" or "user story" that can mean half a dozen
things to as many different people.

When participants disagree on what a word means, they
typically polarize toward the following two attitudes:

- "Oh yeah, refactoring. I know what that is. I tried it
  once. It was a disaster and almost got me fired. If you're
  advocating for refactoring, you must be an idiot, and
  therefore nothing you say is valid."
- "You keep using that word 'unit test'. I do not think it
  means what you think it means. There's no way we can
  possibly have this discussion until you read/learn X. Or
  you could just stop arguing and accept that I'm right,
  because I've read X and you haven't"


If the processes and tools could somehow be checked into the
Git repo, this problem would become a lot more obvious and
concrete. But because processes and tools are these ephemeral,
invisible things, we don't consider the permanent and
concrete effects they have on our code.

I have worked on a dozen different software teams. Some were
happy, productive, and proud of what they did; others less
so. Some built useful things; others worked on products that
caused more trouble than they saved and were eventually
scrapped.

The teams used a diverse set of processes to decide what
to build, when to build it, and how. No two teams used
exactly the same processes, and many teams used
contradictory processes. However, **regardless of the
process, and regardless of how happy or productive the
team members were, they had good reasons
for sticking with that process.** The process was
essential to the quality of their work; removing or
changing any part of it would have harmed the team's
ability to create valuable software.

For example, some teams insisted that all new code be
developed on a branch and then tested and reviewed before
being merged. I'll call this way of working "Type A".
The downside of type-A programming is that it often results
in merge conflicts (and extra expenditure of time to resolve
them) when incompatible branches are developed in parallel.
However, for the type-A teams I worked with, doing without code
review was unthinkable. Code review caught bugs! It caught
design issues! There was no way developers could be allowed
to push code straight to the master branch. So the type-A
process persisted.

Other teams insisted that feature branches were an evil to
be avoided, and required that all code be written by a pair
of developers using test-driven development. I'll call this
way of working "Type B". In type-B programming, testing and
code review happen as the code is written, and whenever the
code passes all the tests it is pushed directly to the
master branch. Because the changes are so small and so
frequent, merge conflicts rarely happen, and when they do,
they are easy to correct. The downside of the type-B way of
working is that, since developers are pairing, the ability of
a team to work on multiple things in parallel is greatly
reduced. Test-driven development also has costs, in the form
of test code and infrastructure that must be maintained
alongside the production code. Teams pay
a large upfront cost for the ability to work in this way.
However, for the type-B teams I worked with, doing without
pairing and tests was unthinkable. You could not have
developers working alone or checking in untested code.
Pairing and tests prevented bugs! They prevented design
issues! The type-B process could not be modified or uprooted
without destroying the team's ability to deliver quality
software.

These observations are not, in themselves, surprising. Of
course teams will be predisposed to do things the way they
are currently doing them, and of course they will argue for
the status quo. A team's reluctance to change does not mean
the team could not benefit from change.

What *is* potentially surprising is that I observed that
teams really *do not benefit* from supposed "improvements"
to their processes.

I tried to introduce pairing and test-driven development to
type-A teams. The hope was that this would reduce the number
of issues found during code review to the point where the
team felt that code review was no longer necessary, at which
point they would be able to fully switch to the type-B
process.

It didn't work. In spite of the tests, the code
still had bugs. In spite of our pair-programming discipline,
code review was still the thing that caught many of those
bugs. And so the team quite reasonably concluded that type-B
was just an extra burden that provided them no value.

The same is true going the other way, from type-B to type-A.
I worked on several type-B teams with developers who
advocated for a type-A process. The hope was that by getting
better at code review we could empower individual developers
to work at their own pace and on their own schedules,
free from the emotionally-draining rigor of pairing. So we
tried adding a work-on-branches, code-review discipline to
our existing type-B process.

This improved nothing. The long-running branches
necessitated by the code review process were riddled with
merge conflicts because of the team's practice of constantly
refactoring (which, in turn, was necessary because the
design was allowed to evolve incrementally without obtaining
consensus from the whole team or the permission of
privileged "architects"). The code reviews themselves tended
not to find substantive issues because of the high level of
test coverage. The team felt that



1. The teams that were happy, productive, and proud were the
  teams that got frequent, high-quality feedback on their
  work (from tests, the users, and each other) and felt
  safe accepting critical feedback.
1. Ad-hoc, quick-and-dirty, "throwaway" code tends to outlive
  polished products. Some of the most useful code I have
  written is unimaginative, poorly designed, and hacky.
  Some of my most carefully-designed, well-tested code
  languishes unused.
2. Truly useful code is often unprofitable; I have seen
  two products go down in flames because the business
  tried to duct-tape moneymaking devices (which users
  hated) onto an otherwise attractive product.

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
