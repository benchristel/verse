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
