# Guide to Verse Functions

This page describes the built-in functions you can use in
your Verse programs.

It is divided into several main sections:

- The **Effects** section describes functions intended for
  use with the `yield` keyword. When combined with `yield`,
  these functions tell Verse to do something that affects
  the outside world, like displaying text on the screen.
- The **Data Processing** section describes functions that
  make it easier to perform common operations on data (like
  numbers and strings of text).
- The **Magic Definitions** section describes functions that
  have some special meaning if you `define` them.

Each function is described using a regular format, consisting
of:

- A **Usage** section that shows (with minimal context) how
  the function is intended to be called. This section
  provides context for the Explanation.
- An **Explanation** of what the function does and how you
  might want to use it.
- A **See Also** section referring to other functions that
  combine nicely with this one or do similar things.
- One or more **Examples** of usage. These are complete
  programs that you can copy-paste into Verse.

## Table of Contents

- [Effects](#effects)
  - [`log`](#log)
  - [`startDisplay`](#startdisplay)
  - [`wait`](#wait)
  - [`waitForChar`](#waitforchar)
- [Data Processing](#data-processing)
  - [`assert`](#assert)
  - [`equals`](#equals)
  - [`lowercase`](#lowercase)
  - [`reverse`](#reverse)
  - [`uppercase`](#uppercase)
- [Magic Definitions](#magic-definitions)
  - [`displayText`](#displaytext)
  - [`run`](#run)
  - [`'test ...'`](#test-)






## Effects

------------------------------------------------------------

### `log`

#### Usage

```js
let message = 'Hello!'
yield log(message)
```

#### Explanation

Causes the `message` to appear at the bottom of the *log
output*, the area at the top of Verse's display. The log
output is then scrolled so the new `message` is visible.

Log messages persist until the program is restarted,
so they're most useful when you want the user of your
program to be able to scroll back through the history. The
disadvantage of `log` (compared to `startDisplay`) is that
once a message is `log`ged it cannot be altered or deleted.

#### See Also

- [`startDisplay`](#startdisplay)

#### Example: Print a message forever

```js
define({
  *run() {
    yield log('theendisnevertheendisnevertheendisnevertheend')
    yield wait(0.1)
    yield retry(run())
  }
})
```

------------------------------------------------------------

### `startDisplay`

#### Usage

```js
let view = function() {
  return [
    'This is line 1',
    'This is line 2'
  ]
}
yield startDisplay(view)
```

#### Explanation

Begins continuously displaying the lines returned by the
`view` function on the screen. The return value of the
`view` should be an array of strings.

[Like all JavaScript functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures),
the `view` function can use variables defined in the same
routine to construct its return value (e.g. the `count`
variable in the examples below). The `view` function
is re-evaluated frequently, ensuring that up-to-date
information is displayed on screen.

When a routine calls `startDisplay`, it "covers up" the
output of any previous `startDisplay` calls made
by other routines. When a routine returns, it clears its
`startDisplay` output and "uncovers"
the previous `startDisplay` call (if any), allowing it to
be shown again.

#### See Also

- [`displayText`](#displaytext)
- [`log`](#log)

#### Example: Count to 10 with a loop

```js
define({
  *run() {
    let count = 0
    yield startDisplay(function() {
      return [
        `The count is ${count}`
      ]
    })
    for (count of range(1, 10)) {
      yield wait(0.5)
    }
  }
})
```

#### Example: Count forever with `retry`

```js
define({
  *run(count = 1) {
    yield startDisplay(function() {
      return [
        `The count is ${count}`
      ]
    })
    yield wait(0.5)
    yield retry(run(count + 1))
  }
})
```

------------------------------------------------------------

### `wait`

#### Usage

```js
let seconds = 10
yield wait(seconds)
```

#### Explanation

Causes the routine to wait for the given number of
`seconds` before continuing. The `seconds` parameter
must be a number: either an integer, or a decimal like
`0.1`.

Waiting for zero seconds, or a negative number of seconds,
does nothing. The routine simply continues as if the `wait`
were not there.

You can `yield wait(Infinity)` to cause the program to halt
forever.

#### Example: Wait for 2 seconds

```js
define({
  *run() {
    yield log('This gets output immediately')
    yield wait(2)
    yield log('This gets output after 2 seconds')
  }
})
```

#### Example: Wait forever

```js
define({
  *run() {
    yield log('This gets output immediately')
    yield wait(Infinity)
    yield log('This is never output')
  }
})
```

------------------------------------------------------------

### `waitForChar()`

#### Usage

```js
let char = yield waitForChar()
```

#### Explanation

Pauses the routine until the user presses a key on the
keyboard. Returns a string indicating which key was pressed.
For keys that type a character, the return value is the
character that was typed.

Possible return values include:

- `"Enter"`
- `"Backspace"` (on many computers, this key is labeled `Delete`)
- A lowercase letter like `"a"`
- An uppercase letter like `"A"`, if the user held the shift
  key down while typing
- A number like `"0"`
- A symbol like `"!"`
- A space `" "`

#### Example

```js
define({
  *run() {
    let key = yield waitForChar()
    yield log('You pressed ' + key)
  }
})
```

------------------------------------------------------------






## Data Processing

------------------------------------------------------------

### `assert`

#### Usage

```js
assert(value, compareFunction, ...expected)
```

#### Explanation

The `assert()` function checks whether the `value` matches
the `expected` items using the `compareFunction`. If they
match, `assert()` does nothing. If they
do not match, it throws an error.

The `compareFunction` may be any function that returns `true`
or `false`. The arguments will be passed to it in this order:

`compareFunction(...expected, value)`

`assert()` is especially useful in tests. You can also use
it to check that the arguments passed to a function are
of the correct type before you try to do things with them.

#### See also

- [`'test ...'`](#test)

Verse has many built-in functions that are appropriate to
use as the `compareFunction`. Here are a few of them:

- `isNumber`
- `isString`
- `is`
- `equals`
- `contains`

#### Example: Checking the arguments to a function

```javascript
define({
  displayText() {
    add('this', 'fails')
  },

  add(a, b) {
    assert(a, isNumber)
    assert(b, isNumber)
    return a + b
  }
})
```

#### Example: Testing basic arithmetic

```javascript
define({
  'test that math works'() {
    assert(3 * 4 - 5, is, 7)
  }
})
```

------------------------------------------------------------

### `equals`

#### Usage

```js
let a = {something: 1}
let b = {something: 1}

if (equals(a, b)) {
  // ...
}
```

#### Explanation

Compares the content of two objects, returning `true` if
the objects are equal and `false` otherwise.

The `equals` function differs from `is` in that it deeply
compares objects and arrays by checking the equality of each
of their properties. The `is` function only does a shallow
comparison, so it will return false if passed two objects
that look the same but are stored at different locations in
memory.

Here is an example of a case where `equals` and `is` return
different values:

```js
let a = {hello: 'world'}
let b = {hello: 'world'}

is(a, b) // false! a and b are two separate objects.
equals(a, b) // true. a and b have equivalent content.
```

#### Caveats

For the sake of speed, `equals` does not do any special
comparison for more esoteric JavaScript objects like
`HtmlElement`. It also does not check the "class" of objects
(indicated by the `constructor` property). Comparing
DOM elements or objects that were constructed with the `new`
operator may produce unexpected results. Verse recommends
that you not use the `new` operator in your programs.

#### See also

- [`is`](#is)

#### Example: Testing that two arrays are equal

```js
define({
  words(sentence) {
    return sentence.split(' ')
  },

  'test words() splits on spaces'() {
    let result = words('three word phrase')
    assert(result, equals, ['three', 'word', 'phrase'])
  }
})
```

------------------------------------------------------------

### `is`

```js
if (is(a, b)) {
  // ...
}
```

#### Explanation

TL;DR use `equals` instead unless you know what you're doing.

Compares two values using [the `===` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Identity), returning `true` if they are identical and
`false` otherwise.

Note that, unlike `equals`, `is` does not look at the
content of objects and arrays when comparing them. It merely
checks if they are the selfsame object. Therefore `is` may
return `false` in cases where `equals` returns `true`.

The main cases where you'd want to use `is` over `equals`
are:

- In tests, to assert that a function returns an existing
  object instead of creating a whole new object that merely
  `equals` the existing object. Creating lots of objects
  unnecessarily can slow down your program, so sometimes you
  may want to test for this.
- When you suspect that the objects you are comparing will
  be identical whenever they are equal, and you can tolerate
  some false negatives.

#### See also

- [`equals`](#equals)

#### Example: Testing that a function doesn't copy an object

```js
define({
  identity(a) {
    return a
  },

  'test identity returns its argument'() {
    let object = {foo: 1}
    assert(identity(object), is, object)
  }
})
```

------------------------------------------------------------

### `lowercase`

#### Usage

```js
let text = 'A Phrase in Title Case'
let output = lowercase(text)
```

#### Explanation

Returns a copy of the `text` with each of the characters
converted to its lowercase equivalent.

Characters in the input `text` that have no lowercase
variant (such as numbers and punctuation) are not affected.
Lowercase letters in the input are also left as-is.

#### Example: Converting a string to lower case

```js
define({
  displayText() {
    return lowercase('i Am sO aNnOyInG')
  }
})
```

------------------------------------------------------------

### `reverse`

#### Usage

```js
let text = 'read me backwards'
let backwards = reverse(text)
```

#### Explanation

Returns a backwards copy of the `text`. The string is
reversed character by character, so `"hello"` becomes `"olleh"`.

#### Example: Backwards "hello world"

```js
define({
  displayText() {
    return reverse('Hello world!')
  }
})
```

------------------------------------------------------------

### `uppercase`

#### Usage

```js
let text = 'some things should be shouted'
let output = uppercase(text)
```

#### Explanation

Returns a copy of the `text` with each of the characters
converted to its uppercase equivalent.

Characters in the input `text` that have no uppercase
variant (such as numbers and punctuation) are not affected.
Uppercase letters in the input are also left as-is.

You might expect that the `uppercase`d version of a string
would have the same number of characters as the original,
but this is not always true. For instance, the German
letter `ß` becomes `SS` when uppercased, so a string
consisting entirely of `ß` characters will double in length
when uppercased.

#### See also

- [`lowercase`](#lowercase)

#### Example: Uppercasing in Spanish

```js
define({
  displayText() {
    return uppercase('¿Cómo estás?')
  }
})
```

------------------------------------------------------------






## Magic Definitions

------------------------------------------------------------

### `displayText`

#### Usage

```js
displayText() {
  return 'some text'
}
```

#### Explanation

If you define a function named `displayText`, its return
value (converted to a string) will be continuously displayed
on the screen. Whenever you change your code, the output
will update.

If `displayText` throws an error instead of returning a
value, the error will be displayed instead of crashing the
program.

#### Example: Messing with math

```js
define({
  displayText() {
    return 1 + 2 + 3 + 4 + 5
  }
})
```

------------------------------------------------------------

### `run`

#### Usage

```js
*run() {
  // ...
}
```

#### Explanation

If you define a routine named `run`, it becomes the "entry
point" to your program. In other words, it's the routine
that Verse will call first, when you tell it to start your
program.

If you define both `*run()` and `displayText()`, the
return value of `displayText()` is shown first. When
you press a key, the `run` routine starts.

#### See Also

- [`displayText`](#displaytext)

#### Example: A one-line program

```js
define({
  *run() {
    yield log('Hello from *run()')
  }
})
```

#### Example: Defining both `displayText` and `run`

```js
define({
  displayText() {
    return 'This is shown until a key is pressed...'
  },

  *run() {
    yield log('...then this is output.')
  }
})
```

------------------------------------------------------------

### `'test ...'()`

#### Usage

```js
'test something cool'() {
  // ...
}
```

#### Explanation

Verse considers functions that begin with the word `test` to
be *tests* for the main program.

Verse calls all of your test functions whenever you
change code. If any of the tests throw errors,
the `TEST` tab will change color. Clicking on the `TEST` tab
shows all the errors encountered by the tests.

#### See also

- [`assert`](#assert)

#### Example: Testing a list-formatting function

Here is an example of some tests for a function called
`listOf`. The `listOf` function takes an array of words and constructs
an English phrase that lists them all, using commas and
"and" as needed.

Though the code for `listOf` looks complicated, the tests
show that it does what it's supposed to, at least for the
four inputs passed to it in the tests.

```javascript
define({
  'test a list of nothing is empty'() {
    assert(listOf([]), is, '')
  },

  'test a list of one item is just that item'() {
    assert(listOf(['cupcakes']), is, 'cupcakes')
  },

  'test a list of two items uses "and"'() {
    assert(listOf(['dogs', 'cats']), is, 'dogs and cats')
  },

  'test a list of three items uses commas'() {
    let list = listOf(['dogs', 'cats', 'bats'])
    assert(list, is, 'dogs, cats, and bats')
  },

  listOf(things) {
    if (things.length < 3) {
      return things.join(' and ')
    } else {
      return things.slice(0, things.length - 1).join(', ')
        + ', and '
        + lastOf(things)
    }
  }
})
```
