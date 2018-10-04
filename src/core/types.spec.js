import { isEmpty, getDefaultValue, checkArgs, isArrayOf } from './types'
import { isString, isNumber } from './nativeTypes'
import { partialApply } from './higherOrderFunctions'

describe('getDefaultValue', () => {
  it('throws if the type predicate throws', () => {
    function bad() {
      throw 'oops'
    }

    expect(() => getDefaultValue(bad)).toThrow('oops')
  })
})

describe('isEmpty', () => {
  it('returns true for an empty array', () => {
    expect(isEmpty([])).toBe(true)
  })

  it('returns true for an empty string', () => {
    expect(isEmpty('')).toBe(true)
  })

  it('returns true for an empty object', () => {
    expect(isEmpty({})).toBe(true)
  })

  it('returns false for an array with one item', () => {
    expect(isEmpty([1])).toBe(false)
  })

  it('returns false for a string with one char', () => {
    expect(isEmpty('a')).toBe(false)
  })

  it('returns false for an object with one key', () => {
    expect(isEmpty({a: 1})).toBe(false)
  })
})

describe('checkArgs', () => {
  const greet_interface = {
    types: [isString],
    example: ['alice']
  }
  function greet(name) {
    checkArgs(greet, arguments, greet_interface)
    return 'hi, ' + name
  }

  const foo_interface = {
    types: [isNumber, isString],
    example: [1, 'a']
  }
  function foo(a, b) {
    checkArgs(foo, arguments, foo_interface)
  }

  const curried_interface = {
    types: [isString, isString],
    curry: 2,
    example: ['a', 'b']
  }
  function curried(a, b) {
    checkArgs(curried, arguments, curried_interface)
    if (arguments.length < curried_interface.curry) {
      return partialApply(curried, arguments)
    }
    return a + b
  }

  const variadic_interface = {
    types: [isNumber, isArrayOf(isNumber)],
    variadic: true,
    example: [1, 2, 3]
  }
  function variadic(first, ...rest) {
    checkArgs(variadic, arguments, variadic_interface)
  }

  it('does nothing if all the arguments match the expected types', () => {
    expect(greet('elias')).toBe('hi, elias')
  })

  it('throws if one argument does not match', () => {
    expect(() => greet(123)).toThrow(Error(`The \`greet\` function was called with unexpected arguments:

  greet(123)

It expected something like:

  greet("alice")`))
  })

  it('throws if the second argument does not match', () => {
    expect(() => foo(1, 2)).toThrow(Error(`The \`foo\` function was called with unexpected arguments:

  foo(1, 2)

It expected something like:

  foo(1, "a")`))
  })

  it('formats arguments separated by commas', () => {
    expect(() => foo('"', 123)).toThrow(Error(`The \`foo\` function was called with unexpected arguments:

  foo("\\"", 123)

It expected something like:

  foo(1, "a")`))
  })

  it('does not throw on a partial function application with currying enabled', () => {
    expect(() => curried('a')).not.toThrow()
  })

  it('throws if the first arg to a curried function has the wrong type', () => {
    expect(() => curried(1)).toThrow(Error(`The \`curried\` function was called with unexpected arguments:

  curried(1)

It expected something like:

  curried("a", "b")

Note that this function supports partial application, so it is OK to supply fewer than 2 arguments.`))
  })

  it('does not show the notice about partial application if all args were passed', () => {
    expect(exceptionMessageFrom(() => curried(1, 2)))
      .not.toContain('Note')
  })

  it('throws if the second arg to a curried function has the wrong type', () => {
    expect(() => curried('a')(1)).toThrow()
  })

  it('notes about variadic functions', () => {
    expect(exceptionMessageFrom(() => variadic('a'))).
      toContain('Note that this function can be called with any number of arguments >= 1.')
  })

  it('throws if not enough arguments are passed', () => {
    expect(exceptionMessageFrom(() => greet()))
      .toContain('greet()')
  })

  it('allows the variadic argument list to be empty', () => {
    expect(() => {
      variadic(1)
    }).not.toThrow()
  })

  it('throws if required args are not passed to a variadic function', () => {
    expect(exceptionMessageFrom(() => variadic()))
      .toContain('variadic()')
  })

  it('throws if extra args are passed', () => {
    expect(exceptionMessageFrom(() => greet('a', 'b')))
      .toContain('greet("a", "b")')
  })

  function exceptionMessageFrom(fn) {
    try {
      fn()
    } catch (e) {
      return e.message
    }
    throw 'Expected exception, but none was thrown.'
  }
})
