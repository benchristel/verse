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

# Hello, World!

Okay, you've installed an awesome web browser and you're
ready to code! [Open this link in a new tab to go to the
Verse code editor](https://druidic.github.io).

The classic introduction to coding is the
"Hello, World" program, which just makes the text "Hello,
World" appear on the screen.

Type the code below into the Verse editor window—the white
area on the left half of the screen. You can copy-paste the
code if you'd rather, but I encourage you to type it out by
hand. This will start building your muscle memory for code.

```javascript
define({
  'try me'() {
    return 'Hello, World!'
  }
})
```

Done already? All right! Click the "run" button to see your
code in action.

Okay, okay, it's not very exciting. But from this simple
program, we can start to learn how Verse structures code.

At the top and bottom of our program we have
`define({ ... })`, which tells the computer
that the stuff in between the `({ ... })` is a list of
**functions** we want it to use. A *function* is a list of
instructions for the computer that tell it how to perform
some task and give us back the result. If you think of the
computer as a cook, a function is like a recipe.

Right below the `define` is the program's first (and so far
only) function. To create a function, we first must give it
a name that describes what it does, which in this case is
`try me`. Following the name, we have a pair
of parentheses `()` and then a pair of curly braces `{}`.
In between the curly braces we put the **statements** of the
function—that is, the steps the computer should perform.
Our function has just one statement, which tells the
computer to take the text `'Hello, World!'` and `return` it
—that is, give it back to us.

In Verse, functions that start with the word `try` are
special. Whatever is `return`ed from them is automatically
displayed on the screen, along with the name of the
function. Most functions don't have this special ability.

> ## Experiments
>
> 1. Delete the `try` from the function name. What
>    happens?
> 2. Change the function name to `try it`. What
>    happens?
> 3. Change the function name to just `try`. Does that
>    work?
> 4. Change the function name back to `try it` and delete
>    the `return`. What result do you see? Put the `return`
>    back.
> 5. The quotes around 'Hello, World!' tell the
>    computer exactly where the text starts and ends. Try
>    changing 'Hello, World!' to 'Doesn't work'. What do
>    you think is causing the problem?
> 6. Change the text 'Hello, World!' to whatever message you
>    want.

# A Note on Formatting

In the "Hello, World" example the code within `define({ ... })`
is indented a couple spaces, and the code within the function
is indented another level beyond that. This indentation is
optional; for example, we could have written

```javascript
define({
'try me'() {
return 'Hello, World!'
}
})
```

but using indentation makes it easier to see which things
are nested inside which other things.
As you type, the editor will helpfully indent
things for you, so for now you don't have to worry too much
about this.

<!--

# Tutorial: Variables

**Variables** are one of the most useful concepts in
programming. A variable is like a container where you can
store information (like text and numbers) that you aren't
going to use right away but want to save for later.

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

-->
