# Function Reference

This page describes each of the functions you can call in
Verse code.

It is divided into several main sections.

- The **Effects** section describes functions intended for
  use with the `yield` keyword. When combined with `yield`,
  these functions tell Verse to do something that affects
  the outside world, like displaying text on the screen.
- The **Data Processing** section describes functions that
  make it easier to perform common operations on data (like
  numbers and strings of text).
- The **Magic Definitions** section describes functions that
  have some special meaning if you `define` them.

## Effects

### `wait(seconds)`

Causes the routine to wait for the given number of
`seconds` before continuing. The `seconds` parameter
must be a number: either an integer, or a decimal like
`0.1`.

Waiting for zero seconds, or a negative number of seconds,
does nothing. The routine simply continues as if the `wait`
were not there.

You can `yield wait(Infinity)` to cause the program to pause
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

### `waitForChar()`

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

## Data Processing

### `reverse(text)`

The `reverse()` function returns a backwards copy of the
string it is passed.

#### Example: Backwards "hello world"

```js
define({
  displayText() {
    return reverse('Hello world!')
  }
})
```

### `uppercase(text)`

The `uppercase()` function returns a copy of the given
string with each of the characters converted to its
uppercase equivalent.

Characters in the input `text` that have no uppercase
variant (such as numbers and punctuation) are not affected.
Uppercase letters in the input are also left as-is.

#### Example: Uppercasing in Spanish

```js
define({
  displayText() {
    return uppercase('¿Cómo estás?')
  }
})
```

#### Caveats

You might expect that the `uppercase`d version of a string
would have the same number of characters as the original,
but this is not always true. For instance, the German
letter `ß` becomes `SS` when uppercased, so a string
consisting entirely of `ß` characters will double in length
when uppercased.

#### See also

- `lowercase`

### `lowercase(text)`

The `lowercase()` function returns a copy of the given
string with each of the characters converted to its
lowercase equivalent.

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

## Magic Definitions

### `displayText()`

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

### `*run()`

If you define a routine named `run`, it becomes the "entry
point" to your program. In other words, it's the routine
that Verse will call to run your program.

If you define both `*run()` and `displayText()`, the
return value of `displayText()` is shown first. When
you press a key, the `run` routine starts.

#### Example: A one-line program

```js
define({
  *run() {
    yield log('Hello from *run()')
  }
})
```

#### Example: Defining both `displayText()` and `*run()`

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
