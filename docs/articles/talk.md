# 8 views of human-scale software

c.f. 36 views of mt. fuji

- what is human-scale software?
- software should be created with the involvement of the
  people who use it and are affected by it
- software should be simple. Complexity destroys reliability,
  and I think in the next several years we'll see a crisis
  of reliability. We'll hand over more control of our
  civilization to hugely complex distributed systems and AIs
  that are often optimizing for things that don't
  really benefit us. We risk losing the ability to understand
  how these systems work, predict their behavior, explain
  failures, or even identify when the systems aren't working
  as they should.
- It is our responsibility, as software developers, to
  create software that works well for its users and is free
  of errors.
- the practices of software development are at the core of
  all of this. We will build the future. But...
- we do not know what we are doing
- we are not like other engineering fields
- we understand how computers work
- what we don't understand is ourselves

- Context-free
  - lots of experts think they have programming figured out
  - "follow these ten steps and you can create more reliable
    software in less time"
  - unfortunately they all disagree about the specifics
    - kent beck
    - sandi metz
    - david nolan
    - jim coplien
    - bob martin
    - gary bernhardt
    - dhh
    - liz keogh
    - zed shaw
    - evan czaplicki
  - this is not entirely unexpected
  - they're all operating from different backgrounds, and in
    different contexts
  - what unites us?
  - context includes the needs of the users, the development
    practices, the tools used for development, and the
    backgrounds of the people designing and writing the code.
  - of these, I believe that the practices and tools used
    to develop code are key.
  - context is notably absent from a lot of the writing
    about software production--especially the element of
    *tooling*. We talk a lot about big picture philosophies,
    and principles, and values, and architectures, but not
    much about concrete specifics: the ecosystems of tools
    and practices we use to achieve those higher-level
    goals. We talk about individual tools and practices,
    some, but that's not enough. Tools and practices are
    deeply interdependent.
  - tools, processes, code form a self-reinforcing ecosystem
    - in an ecosystem, you can't remove or change one part
      without disrupting the whole.
  - a very small-scale example of how tooling affects code:
    - A coworker suggested marking C++ instance member
      variables with a trailing underscore.
    - I thought this unnecessary because our IDE highlights
      member variables and the underscores made reading the
      code less pleasant
    - He pointed out that not everyone who works on this
      code is going to use the same editor we use.
  - larger-scale examples:
    - TDD makes debuggers less useful.
    - pull requests and code review, or pairing and push to master?
    - continuous deployment, or gating QA process?
    - primarily black-box integrated testing,
      or primarily white-box unit testing?
    - all of these are process/tooling decisions that affect
      the shape of the code and the nature of the product.
      - shape of code: TDD vs integrated testing changes how
        concerns are united or separated in code modules,
        which in turn reinforces the testing strategy
      - nature of product: CI/CD leads to frequent, small
        releases, prioritizing MTTR over MTBF. QA does the
        opposite.
  - We can imagine future tools that would change our
    practices
    - We often say "don't do trivial refactorings like
      whitespace changes or reordering methods in a class
      as part of a big feature PR, because they just make
      the diff harder to read". What if we had diff tools
      that understood the semantics of our language?
  - if we are to say anything falsifiable about software
    development, the context of those statements needs to be
    understood
  - tech changes so fast that no two applications,
    libraries, systems, are really developed in the same
    context
  - what we need is a set of reference environments for
    writing and running code that can be critiqued, as
    wholes, from various angles. That way we can finally
    have something knowable to talk about.
  - Verse is one such environment--designed as a statement
    about my own views on software development.
  - Attributes of such an environment
    - Must be complete and self-contained (as far as
      possible): one set
      of tools, one standard library, one way of testing
      and delivering applications
    - constrain the development process in some
      interesting way (with the intention of benefitting
      developers and/or users). If there are no constraints,
      the system simply enables "programming" and we're
      back where we started
    - Must be minimal - only necessary tools are included.
      Otherwise, we'll get into arguments (as we do now)
      about which tools we like better. Our view of the
      whole system of interacting tools will be impaired--
      no one will have the whole view

- we need pattern languages for software
  - like gang of four patterns?
  - well no.
  - something like Kathy Sierra's idea of "lots and lots of
    very high-quality examples"
  - a pattern language that, once learned, allows one to
    construct useful, ergonomic software within a
    particular context without having
    to think everything out from scratch every time.
  - Brian Marick on why patterns failed "design patterns
    started out with not enough building blocks, that were at
    too low of a level" (https://www.deconstructconf.com/2017/brian-marick-patterns-failed-why-should-we-care)
  - at a very high level, computers do two things: they
    perform transformations of data, and they communicate
    between systems.
    - Computation and Communication
    - The tools and techniques we use to
      accomplish and coordinate these two classes of tasks,
      I believe, can be largely invariant between systems.
      These tools and techniques together form patterns.
      Each tool/technique cannot be considered in isolation;
      it is related to others by a network of connections.
    - Examples:
      - TDD and testing frameworks
      - type systems, IDEs, refactoring tools, and compilers
      -
  - this means that even "laypeople" can build things that
    are useful and pleasing to them.
  - important to Alexander because he wants to improve the
    built environment on a scale that's infeasible if only
    architects are doing it
  - architects love to be "creative"
  - but constraints actually allow greater creativity by
    allowing us to focus our attention on what makes our
    current project unique, rather than being
    distracted by details that are really invariant across
    projects
  - would the creative power of language be improved if
    we had to restrict ourselves to the most common 800
    words? Is the creative power of programming improved
    by only writing assembly language?
  - the power of language comes from its ability to
    innovate and leverage higher-level concepts
  - each pattern in a language specifies a context in
    which it's appropriate

- the context of the rest of this talk is applications
  programming--that's where I have the most experience.
- specifically, applications where a lot of the UI intelligence
  is on the client side, and the network is used just to
  transfer data to a storage medium

- do pattern languages for software already exist?
  - Visual Basic applications
  - yes, they're ugly
  - yes, the code is most likely buggy, slow crap
  - but they *don't die*
  - medical professionals use ancient windows apps all the time
  - why?

  - a programmer's perspective on VB

- I programmed in Visual Basic for a decade...
  - starting at the age of 8
  - i never learned what a compiler was
  - didn't know about bytecode, system calls, stack vs. heap memory
  - didn't fully grasp the recursive nature of syntax
  - didn't have source control
  - put all my code in event handler routines
  - made a Guitar Hero clone with 3D graphics and a level editor
- this is not meant as a defense of this type of naive programming
  - because there were things that I could imagine but dared not attempt
  - didn't know oop or similar techniques for structuring code
  - adding new features became extremely difficult after a certain point
  - but clearly VB provided a pattern language of sorts that I could
    use without really knowing what a computer was

- a colleague of mine once remarked that "Visual Basic ruins programmers"
- gives them habits that they never unlearn
- he didn't specify what those habits are, but I can imagine them
  - tying all logic to the UI
  - using global variables indiscriminately
  - primitive obsession -- using built in datatypes instead of creating new ones
- I assured him that no, really, I'd gotten over it. I'm hip with the OOP, the TDD, the FRP
- but I kept thinking about what he said, and you know, I
  actually have been ruined by VB. It has fundamentally
  warped my beliefs in a way that can never be undone:

- Here are the symptoms that I've observed:
- Symptoms of VB poisoning:
  - I think programming is fun
  - I think programming should not be hard
  - the user's mental model of a system should dictate its architecture
  - pretty UIs are not as fun as making something work
  - the standard library should make third-party libraries unnecessary
  - the built-in tooling should make third-party tools unnecessary

- But I also believe
  - We've moved on (rightfully) from VB
  - We should demand better languages, better tools, better
    code, and better programs

- VB provides a pattern language for applications that is
  shared between users and developers.
- It provides all the tools needed to write, run, and debug
  those applications
- it is a known, constant context in which we can evaluate
  the suitability of programming patterns
- Only when the context is known can we develop pattern
  languages.
- VB provides a remarkably deficient set of patterns, but
  *they are patterns*. That's why VB was successful.
  - Anyone can apply the patterns
  - People use Visual Studio to write VB code, so the tools
    used are invariant.
    - makes it easier for practitioners to communicate
  - It is unambiguous in which contexts they are applicable
  - Users and programmers of VB applications speak the same
    pattern language

- fast tests
  - I've long been a proponent of fast unit tests and the
    incredible fidelity of feedback they enable
  - I used to say your entire test suite should run in < 300ms
  - After doing some experiments on my own, I'm now lowering
    that to 100ms (including compilation of code
    that changed since the last test run)
    - not arbitrary: 90ms is about the threshold of "noticeability"
    - most of us type about 10 characters per second
    - this means we can run tests on every editor keystroke
    - requires an incremental compiler (or JIT compiler)
    - not my idea—Michael Feathers proposed such a dev environment
      in WEWLC. I just implemented it ;)
    - you never have to wonder "did I run the tests after making that change?"
      "is this test result up to date?" "when did this start failing, exactly?"
    - the biggest hurdle I've seen when trying to get people
      to start doing TDD is that they don't run the tests
      often enough. They write a test. See it fail. They
      write some code. Then they *look at the code to see if it's right*
      then they're like "TDD is too much work". Yeah, it is!
      If you're still staring at your code the same amount,
      and also writing unit tests, yes, TDD is more work.
    - but there's a reason people do this, I think. The
      feedback they can get from staring at code is not
      that high-quality, but it is *immediate*. The code
      is right there! Their test results, on the other hand,
      are in some hypothetical future where they ran the
      tests and waited several seconds for them to pass.
    - We also tend to see negative feedback as a bad thing.
      When we expect the tests to pass, we don't want to
      see failures, so we check things over before running
      the tests so we don't have to be embarrassed that we
      failed. But by doing that, the whole cycle actually
      takes longer.
    - The way around this is simply to *always be testing*.
      When you can run the tests effectively constantly,
      the feedback is right there. It's as immediate as the
      code itself.
    - When the test results are as everpresent and unavoidable
      as the code, we don't have to be embarrassed when tests
      fail.
  - So, 100ms tests. To be clear, this is not a pipe dream.
    I've done it. It works.

- of course, you cannot get to sub-100ms test runs with
  business-as-usual architectures. They're simply too slow.
  So let's talk about performance.

- The performance trap
  - The most common source of pushback I get when I suggest
    refactoring code is that it won't be performant.
  - This argument almost always comes from people whose unit
    tests take anywhere from several seconds to several
    minutes to compile and run.
  - In the past, it was mind-boggling to me that the same
    people who were so concerned about squeezing every
    ounce of performance out of their code would tolerate
    slow tests. But I think these phenomena actually go
    hand in hand in a weird way.
  - if you write slow tests, you'll think computers are
    slower than they are.
  - You'll constantly be faced with
    the evidence that your tests, and therefore *code you
    wrote* is slowing down your development, and will slow
    down your users too.
  - so performance will always be in the front of your mind.
  - but it's not true. *your code* isn't slow. Other people's
    code is always slower.
  - I know this effect exists because I've experienced it
    myself, when writing JS tests in Jasmine.
  - The vicious cycle:
    - write tightly-optimized, tightly-coupled code with
      hard-to-test internal interfaces
    - write integration tests because you can't write
      expressive unit tests
    - realize with horror that your integration tests are slow
    - reinforces the subconscious belief that computers
      are slow
    - Doesn't matter if you know that your clock speed is 3GHz
    - Your brain can't conceptualize numbers that big. The
      part of your brain that handles gut reactions to things
      thinks computers are slow, because your tests are slow
    - You experience anxiety when writing unoptimized code
    - You continue to not unit-test
  - Not all performance penalties are created equal
    - doubling cost of something that happens every 100ms
      from 1ms to 2ms probably won't hurt
    - doubling from 100ms to 200ms is disastrous
  - It is insane to optimize from 2ms to 1ms if the cost
    is the verifiable correctness of your program
  - Break the cycle: write unit tests -> believe that
    your code is fast until proven slow
  - "Code is fast until proven slow, and incorrect until
    proven correct" (beyond a reasonable doubt)
- Our existing unit test frameworks don't do a good job
  of rescuing us from this cycle
  - Jest, a popular JavaScript testing framework, takes
    - ~500µs to run 1 test
    - ~30µs to assert that 1+1 == 2
    - from this you might conclude "oh no, javascript is slow"
      - you'd be wrong
      - I wrote my own `assert` function
      - 14ms to make 1e7 assertions = ~1.4ns per assertion (4 instructions)
      - I'm cheating obviously because doing something a million times in JS
        is going to make the JIT compiler optimize the heck out of it
        ```
        it('is actually pretty fast', () => {
          var i
          for (i = 0; i < 1e7; i++) {
            assert(1 + 1, eq, 2)
          }
          assert(i, eq, 1e7)
        })

        function eq(a, b) {
          return a === b
        }

        function assert(a, predicate, b) {
          if (!predicate(a, b)) {
            throw new Error('assertion failure')
          }
        }
        ```
      - but it doesn't optimize the Jest assertions as well
      - JS is not (fundamentally) slow. Libraries are slow.
      - Why?
      - General-purpose code is slower
      - Jest is slow because it's general-purpose. It
        makes few assumptions about your tests or code.
        It is loaded down with features I don't need or use.
      - In turn, the compiler can make few assumptions about
        Jest.
      - compare to other test libraries: Jasmine is even slower
        - ~1ms overhead per test
        - Starting a new JS runtime for each test run is hugely wasteful
          because you're throwing away all the JIT-compiled code
- third-party code is almost always the performance bottleneck.
- architecting for performance means keeping calls to other
  code/services to a minimum
- what's at the center of *your* program?
  - (in the sense of being invoked/depended on by most of the code in the system)
  - is it the database?
  - the filesystem?
  - a third-party framework?
  - the UI? (VB has this problem)
  - or is it (gasp) *your code*?
- If it's *your code*, your program will be fast.
  Otherwise, it will be slow.
- I'm oversimplifying hugely here. You should not be rolling
  your own lists, stacks, queues, or parsers—libraries with
  optimized, well-tested code can do better. Obviously you
  will need such general-purpose code, and when you do, you
  should not write it. But your *business logic* should
  be at the center of the system.
- Write code that allows you to make simplifying assumptions
  - immutable data structures let you trade memory for time
    by caching aggressively and shortcutting by-value
    comparisons.
  - CPUs are not getting much faster. We haven't seen
    the massively multicore processors that some of us were
    anticipating a few years ago.
  - But memory technology is improving. We're on the cusp
    of having nonvolatile RAM.
  - That's a game-changer because applications don't have
    to write their state to disk. They can simply be
    resident in memory, and will stay there even if the
    machine restarts.
  - We won't have to think about serialization formats anymore
  - disk access is no longer an appropriate cost model.
  - of course, upgrading an application then becomes a
    bug-ridden nightmare. How can you replace the code and
    expect the objects in memory to just adapt to work with
    the new code? The very thought should make you sweat.
  - but in fact, web developers have known how to deal with
    this situation for a long time. We write stateless
    server processes where all the state is in a database.
    When we deploy a new version of the code, we migrate
    the database, adding new columns and transforming data
    as needed.
- conclusions:
- fast unit tests are possible, even in JavaScript
- by writing tests that are fast, we can train ourselves
  out of performance paranoia
- fast tests are easy to write when code is a pure function
  (data in, data out, no side effects)
- by moving dependencies to the periphery of our systems, we
  *will* write performant code.
- it will be easy to optimize the parts that are slow
- storage technology will enable us to push applications
  toward being all-in-memory
- https://blog.cleancoder.com/uncle-bob/2017/12/09/Dbtails.html
  Uncle Bob thinks relational databases will go extinct
  because of SSDs...

- So... let's talk about functional programming.
  - immutable data structures
  - functions are values
  - functions are lambdas (can have free variables whose values
    come from the scope where the function is defined)
  - as a consequence of immutability, reference cycles between
    objects are not possible (nice for gc)
    - makes some data structures like doubly-linked lists impossible
  - in its strictest form, functional programming is annoying af
    - can't reassign to variables, so instead of looping, you
      need to use recursion -- basically create a new stack frame
      with the new variable values.
    - tail-call optimization stops you from blowing up the stack
    - this is not easier to understand than just using a loop >:(
    - really. I've tried both. There is a bijection in my brain
      between the two structures. They're the same. Stop trying
      to argue that FP is better because it doesn't have freaking LOOPS.
    - it's better because of higher-order functions and
      immutable data. Those are actually useful mental tools.
      A lack of for loops is not a useful mental tool.
  - another hallmark of FP is that there are no
    stateful objects. You can have things that act sort
    of like objects in the sense that they unite data and
    behavior, but mutable state is right out
  - all state is in one place—in a giant tree/DAG
  - how is this better than just having global variables?
    - the mutation of those global variables is tightly controlled
  - making all state global and persistent is kind of the only
    sane way to structure applications. It's been the de facto
    standard for web servers for many years (stateless processes,
    all state in databases).
  - Recently we realized that the same applies to UIs (Redux, Elm)

- the reason is simple: users don't think in terms of components.
- they expect every part of an application to be able to
  communicate with every other part and they get really
  frustrated when you tell them they can't.
  - ever call customer service for some product after you
    explain your problem they say they'll call you back...
    then the person who calls you doesn't know any of the
    stuff you told the first person you talked to?
  - people don't want to talk to individuals or departments.
    they want a consistent interface to the entire system.
  - fictional example: you make issue tracking software that
    displays lists of items, which can have labels or tags
  - clicking on a label anywhere in the UI searches for
    that label, which has
    effects on many different parts of the UI. The search
    bar populates, the lists get filtered, other instances
    of that label that are on the UI get highlighted in
    a different color...
  - if you design your components to each maintain their
    own independent, internal state, implementing a
    seemingly simple request like this is really hard.
  - search bar normally doesn't take orders from anyone
    but the keyboard
  - you've probably gotten feature requests like this,
    where you had all the little pieces of your design
    neatly isolated and then you get a feature request
    that completely destroys that isolation. So what do
    you do? You add a MessageBusSingleton.
  - A message bus is the gateway to chaos. It's just a nice
    way to pretend that you understand how your program
    works.
  - in order to verify that it actually works, you need to
    have acceptance tests that exercise the whole system.
  - but the message bus means that in order to run those
    tests we need the whole system running and integrated,
    including the UI, and that means those tests are going
    to be slow, violating our 100ms rule.
  - so let's talk about how to write fast acceptance tests.

- This is where Verse gets really opinionated in a way that
  will probably be controversial.
- Acceptance tests, pretty much by definition, are tests
  that exercise the system the way a user would.
- In most systems, this means starting the whole system,
  UI and all, and having some automated way of poking the UI
  to simulate mouse interactions and keyboard input.
- but this means the tests are *coupled* to the UI. When the
  UI changes, the tests have to change.
- These types of tests are notoriously slow and flaky. Labs
  used to have a culture of writing acceptance tests for
  every feature, but we've largely moved away from that.
  It's kind of silly for programmers to write these tests
  (http://blog.cleancoder.com/uncle-bob/2013/09/26/AT-FAIL.html)
- The way around is to couple the tests to UI semantics,
  not details like where a button is in the HTML document
- but in order to know the semantics of the UI, the test
  framework must constrain the structure of the UI.
- without these constraints, it's harder to have confidence
  in the test
  - say the test simulates a click on a button, but the
    button is not actually visible on the page due to a
    layout bug. The test will pass, but the software's not
    shippable...
  - Verse requires that all UI controls be part of a "form",
    whose layout Verse controls. You're limited in what
    you can do with these controls, so you can't break them
    in a way that the tests can't catch.

```js
'test RPN addition'() {
  scenario('Adding $1 and $2 displays $3',
  (a, b, result) => {
    Simulator.startFrom(mainScreen)
      .clickButton(a)
      .clickButton('Enter')
      .clickButton(b)
      .clickButton('Enter')
      .clickButton('+')
      .expectDisplayed(result)
  }, [
    ['1', '2', '3'],
    ['2', '2', '4'],
    ['5', '6', '11']
  ])
}
```

A test like this can run in microseconds, because it doesn't
touch the *real* UI at all.

- permanence: You can download Verse (it's just an HTML page,
  about 700kb — hit cmd-S in your browser) and use it
  forever in Firefox or Chrome
  (well, until those browsers break backward compatibility
  with features that are now part of the web standard, so
  as close to forever as practically achievable)
- I'll make mistakes while designing Verse, and I don't want
  to be locked into those mistakes. I also don't want to
  break people's code with my changes.

- experts disagree (Climbing on Mt. Fuji)
- pattern languages (Great Wave off Kanagawa)
- ecosystems (Mount Fuji from the mountains of Totomi)
- fast tests (watermill at Onden)
- functions and routines (Lightning below the Summit)
- interfaces are monolithic (Mishima Pass in Kai Province)
- acceptance testing (Under Mannen Bridge)
- permanence (Mount Fuji reflects in Lake Kawaguchi)
