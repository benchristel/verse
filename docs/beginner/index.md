Awesome! I'm so glad you've chosen Verse for learning to
program. Coding is (or can be, at least) one of the most
fun hobbies/careers out there, so I hope I can impart some
of that joy in these tutorials.

If you get stuck or have any questions as you work through
the examples and exercises, please email me at (my
name)@gmail.com and I'll do my best to help you out. My name
is the same as my Github username, which is in the URL of
this page (hopefully this little treasure hunt will prevent
me from getting too much email spam...)

# Supported Platforms

Before we get started, let's make sure you have the right
setup. Currently, Verse should work on the following
systems:

- Windows
- macOS 10.11 (El Capitan) or newer

Additionally, you'll need the latest version of one of
these web browsers:

- Firefox
- Chrome

Support for more platforms (including mobile) is coming
soon, but for now it's just these. If there's a particular
OS or browser you think I should support, just email me.
If enough people ask for it, I'll figure out a way to
make it work.

# Tutorial: Hello, World!

Okay, you've installed an awesome web browser and you're
ready to code! The classic introduction to coding is the
"Hello, World" program, which just makes the text "Hello,
World" appear on the screen.

Type the code below into the Verse editor window—the white
area on the left half of the screen. You can copy-paste the
code if you'd rather, but I encourage you to type it out by
hand. This will start building your muscle memory for code.

```javascript
define({
  *init() {
    yield log('Hello, World!')
  }
})
```

Done already? All right! Click the "run" button to see your
code in action.

Okay, okay, it's not very exciting. But from this simple
program, we can start to learn how Verse structures code.

At the top we have `define({`, which tells the computer
that we're about to give it a list of **functions**. A
*function* is a list of instructions for the computer that
tell it how to perform some task.
If you think of the computer as a cook, a function is like a
recipe.

In our hello world program, `init` is the only function.
It's a recipe with one step that tells the computer to
put the text `Hello, World!` on the screen. Don't worry
about what the `*` and `()` do; we'll cover those later.
For now, just note that all steps of the function must
go between a pair of curly braces (`{}`) after the name
of the function.

In the example code the `*init()` function is indented
a couple spaces, and the code within the function is
indented another level beyond that. This indentation is
optional; for example, we could have written

```javascript
define({
*init() {
yield log('Hello, World!')
}
})
```

but using indentation makes it easier to see the structure of
the code. As you type, the editor will helpfully indent
things for you, so for now you don't have to worry too much
about this.

## Exercises

- Try changing the text `Hello, World!` to a message of your
  choice and run the program again.
- The text `Hello, World!` is surrounded by single quotes to
  tell the computer that it's just data, not part of the code
  *per se*. The text is also colored red in the editor to
  show that that's how the computer is interpreting it.
  What happens if you remove the quotes?
- Put the quotes back. Run the program once to make sure
  it's working again. Now try changing `Hello, World!` to
  `Doesn't work`. What do you think is going wrong? Don't
  worry, we'll learn how to fix this later.

# Tutorial: The Empty Function

This one has the flavor of a Zen koan: what's produced by
a recipe with no steps?

```javascript
define({
  *init() {
  }
})
```

Here, we've removed the code that outputs "Hello, World"
from the `init` function. If you run this program, it
doesn't output anything, but it also doesn't crash.

This may seem bizarre, but functions that do nothing have
their uses. We'll learn more about them later.

# Tutorial: Adding More Code

For example, here's a program that puts two lines of text
on the screen:

```javascript
define({
  *init() {
    yield log('Hello, World!')
    yield log('Whoa!')
  }
})
```

You can continue this pattern to output as many lines as
you want.

# Tutorial: Variables

**Variables** are one of the most useful concepts in
*programming. A variable is like a container where you can
*store information (like text and numbers) that you aren't
*going to use right away but want to save for later.

We can create a new variable using the `let` keyword. When
we create a variable we have to give it a name so we can
refer to it later.

For example, this code (which you'd normally put inside a
function), creates a variable named `awesomePerson`.

```javascript
let awesomePerson
```

Once we have a variable, we can store some information in it
using the `=` symbol:

```javascript
let awesomePerson
awesomePerson = 'Margaret Hamilton'
```

As a shorthand for the above, we can use `let` and `=` at
the same time:

```javascript
let awesomePerson = 'Margaret Hamilton'
```

Stuff we've stored in a variable is called the *value* of
that variable. We can get the value of a variable back out
just by using its name, like this:

```javascript
yield log(awesomePerson)
```

Putting it all together, we can write programs like this:

```javascript
define({
  *init() {
    let awesomePerson = 'Margaret Hamilton'
    let accomplishment =
      'Wrote guidance software for the Apollo moon landings'

    yield log(awesomePerson)
    yield log(accomplishment)
  }
})
```
