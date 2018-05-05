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

> If it doesn't work, and the message "Can't run" appears at
> the top of the screen, you may have made a typo. Check back
> over the code and try to find the problem. Worst case,
> just copy-paste the code from this tutorial into the
> editor.
>
> If you've copy-pasted it and it *still* doesn't work,
> please email me and let me know.

Okay, okay, this program is not very exciting. But even from
this simple example, we can start to learn how Verse
structures code.

At the top and bottom of our program we have
`define({ ... })`, which tells the computer
that the stuff in between the `({ ... })` is a list of
**functions** we want it to use. A *function* is a list of
instructions for the computer that tell it how to perform
some task and give us back the result. If you think of the
computer as a cook, a function is like a recipe.

Right below the `define` is the program's first (and so far
only) function. To create a function, we first give it
a name, which in this case is
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

# Shouting at the World

Our program is currently rather uninteresting. Let's see if
we can make it automatically transform our "Hello, World"
greeting into ALL CAPS SO IT LOOKS LIKE IT'S SHOUTING.

```javascript
define({
  'try me'() {
    return uppercase('Hello, World!')
  }
})
```

Here we see our first example of how to *call*, or use, a
function in JavaScript. We're calling a function named
`uppercase` by mentioning its name
and following it with a
pair of parentheses. Between the parentheses, we feed in
some data: the text 'Hello, World!'. The function
processes the text and gives us back the result, which we
`return` so it is displayed on the screen.

Returning to our functions-are-recipes metaphor:
calling a function is like shouting to the cook "one order
of fried applesauce for table 6, please!". Except instead,
we're asking for "one order of uppercase hello world!"

Just to illustrate this, here's how we'd ask the
computer for fried applesauce:

```javascript
define({
  'try me'() {
    return fried('applesauce')
  }
})
```

And this would totally work if our computer knew how to
fry text. Unfortunately, it doesn't... yet. Don't worry,
we'll get there.

You may be wondering where the `uppercase` function comes
from. In other words, why does `uppercase` work but `fried`
doesn't? The answer is pretty boring: the `uppercase`
function is just built into Verse. A list of built-in
functions and how to use them ~~is available here~~ will be
available once I get my act together.

## The Beauty of Functions

If you just look at the output of our little program, it's
exactly the same as if we'd written

```javascript
define({
  'try me'() {
    return 'HELLO, WORLD!'
  }
})
```

That's because a *function call* like `uppercase('Hello, World!')`
stands in for the result of the function. You can replace
one with the other and the output of the program won't
change. The five-dollar term for this is *referential
transparency*, which you can now use to impress all your
friends.

Of course, you may be wondering: why *not* just replace the
function call with the uppercased result? It would be a lot
simpler! But then we would be doing work that the computer
can do much more quickly and accurately. The nice thing
about calling `uppercase` is that we can now convert any
text we want to all-caps, just by copy-pasting it into our
program. Try it with this paragraph! Just make sure you have
quotes around the text so the computer knows where it begins
and ends.

At this point, you may be starting to sense that functions
have a beautiful kind of usefulness. Once you know the name
of a function and what it does, it's like having a new skill
that you can use everywhere. A good cook knows not only how
to make `fried('applesauce')`, but `fried('lamb chops')` or
`fried('crème brûlée')` too. Just as *frying* is a process that can
be applied to almost anything, *uppercasing* is a process
that can be applied to any text. In programming, this type
of simple process
that can be applied to an infinity of different
objects is called an *abstraction*.

# Talking Backwards

Let's try out another function that's built into Verse:
`reverse`, which takes a string of text and returns a
backwards version of it, so `hello` becomes `olleh`.

```javascript
define({
  'try me'() {
    return reverse('Hello, World!')
  }
})
```

> ## Experiments
>
> 1. Try replacing "Hello, World!" in the program above
>    with a message of your choice.
> 2. A word or phrase that is spelled the same forwards and
>    backwards is called a *palindrome*. Use the `reverse`
>    function to demonstrate that `tacocat` is a palindrome. Or
>    this epitaph for Napoleon: `able was I ere I saw elba`.
> 3. Try writing a program that outputs the reversed,
>    uppercase version of a string: that is, if you paste in
>    the text 'hello world' it should output 'DLROW OLLEH'.
>    Hint: remember that a function call stands in for the
>    result of the function.
> 4. It seems like `reverse(uppercase('hello'))`
>    and `uppercase(reverse('hello'))` always produce the
>    same output. Why do you think this is?
> 5. What do you expect `reverse(reverse('hello'))` to output?
>    Try it!

<!--
# Hello, You!

What's next for our "Hello, World" program? How about a
program that greets a specific person, given their name?

```javascript
define({
  'try me'() {
    return greetingFor('Alex')
  },

  greet(name) {
    return 'Hello, ' + name + '!'
  }
})
```

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
