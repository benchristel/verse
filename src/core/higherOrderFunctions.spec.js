import { curryable, nameWithArgs, abbreviate } from './higherOrderFunctions'

describe('curryable', () => {
  // TODO: partialApply is only tested through curryable.
  // Test partialApply directly, and remove these tests
  // and curryable, which is not used anywhere.
  it('calls the wrapped function only when the requisite number of args have been passed', () => {
    let args
    let foo1 = curryable(2, function foo(a, b) {
      args = [a, b]
      return 'hi'
    })
    expect(args).not.toBeDefined()
    foo1(1)
    expect(args).not.toBeDefined()
    expect(foo1(1, 2)).toBe('hi')
    expect(args).toEqual([1, 2])
  })

  it('enables currying', () => {
    let args
    let foo1 = curryable(3, function foo(a, b, c) {
      args = [a, b, c]
      return 'wow'
    })
    expect(foo1(1)(2, 3)).toBe('wow')
    expect(args).toEqual([1, 2, 3])
    expect(foo1(4)(5)(6)).toBe('wow')
    expect(args).toEqual([4, 5, 6])
    expect(foo1(7, 8)(9)).toBe('wow')
    expect(args).toEqual([7, 8, 9])
  })

  it('works on 1-adic functions', () => {
    let args
    let foo1 = curryable(1, function foo(a) {
      args = a
      return 'hi'
    })
    expect(foo1()(1)).toBe('hi')
    expect(args).toBe(1)
    expect(foo1()()(2)).toBe('hi')
    expect(args).toBe(2)
  })

  it('has no effect on 0-adic functions', () => {
    let args
    let foo1 = curryable(0, function foo() {
      return 'wow'
    })
    expect(foo1()).toBe('wow')
  })

  it('names the function', () => {
    let args
    let foo1 = curryable(3, function foo() {})
    expect(foo1.name).toBe('foo')
    expect(foo1(1).name).toBe('foo(1)')
    expect(foo1(1)(2).name).toBe('foo(1, 2)')
  })
})

describe('nameWithArgs', () => {
  it('returns the base name when there are no arguments', () => {
    expect(nameWithArgs('foo', [])).toBe('foo')
  })

  it('formats one argument in parens', () => {
    expect(nameWithArgs('bar', [1])).toBe('bar(1)')
  })

  it('converts a nonexistent name to <function>', () => {
    expect(nameWithArgs(undefined, [])).toBe('<function>')
  })

  it('converts a nonexistent name with args to <function>(...)', () => {
    expect(nameWithArgs(undefined, [1])).toBe('<function>(1)')
  })

  it('converts a non-string name to <function>', () => {
    expect(nameWithArgs(true, [])).toBe('<function>')
  })

  it('converts an empty name to <function>', () => {
    expect(nameWithArgs('', [])).toBe('<function>')
  })

  it('quotes string arguments', () => {
    expect(nameWithArgs('f', ['a'])).toBe('f("a")')
  })

  it('abbreviates long arguments', () => {
    let long = 'this is a pretty long string'
    expect(nameWithArgs('foo', [long])).toBe('foo("this is a ...")')
  })
})

describe('abbreviate', () => {
  it('represents the empty string as empty quotes', () => {
    expect(abbreviate('')).toBe('""')
  })

  it('stringifies null and undefined', () => {
    expect(abbreviate(null)).toBe('null')
    expect(abbreviate()).toBe('undefined')
  })

  it('stringifies booleans', () => {
    expect(abbreviate(true)).toBe('true')
    expect(abbreviate(false)).toBe('false')
  })

  it('stringifies regexps', () => {
    expect(abbreviate(/a?bc+/)).toBe('/a?bc+/')
  })

  it('represents symbols', () => {
    expect(abbreviate(Symbol())).toBe('Symbol()')
  })

  it('does not truncate strings of <= 10 characters', () => {
    expect(abbreviate('this is a')).toBe('"this is a"')
    expect(abbreviate('this is ok')).toBe('"this is ok"')
  })

  it('truncates strings of 11 chars or longer', () => {
    expect(abbreviate('this is not')).toBe('"this is no..."')
  })

  it('truncates strings of 11 chars or longer', () => {
    expect(abbreviate('this is not')).toBe('"this is no..."')
  })

  it('escapes internal quotes in strings', () => {
    let esq = '\\"' // literally: \"
    expect(abbreviate('"hi"')).toBe(`"${esq}hi${esq}"`)
  })

  it('escapes newlines', () => {
    expect(abbreviate('whoa\nthere')).toBe('"whoa\\nthere"')
  })

  it('escapes backslashes in strings', () => {
    let esb = '\\\\'
    expect(abbreviate('\\hi\\')).toBe(`"${esb}hi${esb}"`)
  })

  it("doesn't truncate in the middle of an escape sequence", () => {
    expect(abbreviate('a""""""""""')).toBe(`"a\\"\\"\\"\\"\\"\\"\\"\\"\\"..."`)
  })

  it('converts numbers to strings', () => {
    expect(abbreviate(10)).toBe('10')
    expect(abbreviate(1e21)).toBe('1e+21')
    expect(abbreviate(0xff)).toBe('255')
  })

  it('represents empty objects as in JSON', () => {
    expect(abbreviate({})).toBe('{}')
  })

  it('skeletonizes objects with properties', () => {
    expect(abbreviate({a: 1})).toBe('{...}')
  })

  it('represents empty arrays as in JSON', () => {
    expect(abbreviate([])).toBe('[]')
  })

  it('skeletonizes arrays with items', () => {
    expect(abbreviate([0])).toBe('[...]')
  })

  it('represents functions by their name', () => {
    expect(abbreviate(abbreviate)).toBe('abbreviate')
  })

  it('represents anonymous functions as <function>', () => {
    expect(abbreviate(function() {})).toBe('<function>')
  })
})
