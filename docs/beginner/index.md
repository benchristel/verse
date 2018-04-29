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
program, we can start to learn how JavaScript (the
programming language Verse uses) structures code.

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
go between the curly braces (`{}`) after the name
of the function.

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
