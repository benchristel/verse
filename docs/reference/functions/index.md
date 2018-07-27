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

#### Example

```js
define({
  *run() {
    yield log('This gets output immediately')
    yield wait(2)
    yield log('This gets output after 2 seconds')
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
    yield log("You pressed " + key)
  }
})
```

## Data Processing

## Magic Definitions
