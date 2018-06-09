import {
  doWith,
  lowercase,
  replace,
  reverse,
  uppercase,
  curryable,
  get,
  range,
  count
} from '.'

describe('uppercase', () => {
  it('does nothing to the empty string', () => {
    expect(uppercase('')).toBe('')
  })

  it('upcases alphabetic characters', () => {
    expect(uppercase('hello there')).toBe('HELLO THERE')
  })

  it('stringifies input', () => {
    expect(uppercase(1)).toBe('1')
  })

  it('is on the window object', () => {
    expect(window.uppercase).toBe(uppercase)
  })
})

describe('lowercase', () => {
  it('does nothing to the empty string', () => {
    expect(lowercase('')).toBe('')
  })

  it('upcases alphabetic characters', () => {
    expect(lowercase('YIKIES')).toBe('yikies')
  })

  it('stringifies input', () => {
    expect(lowercase(1)).toBe('1')
  })

  it('is on the window object', () => {
    expect(window.lowercase).toBe(lowercase)
  })
})

describe('reverse', () => {
  it('does nothing to the empty string', () => {
    expect(reverse('')).toBe('')
  })

  it('does nothing to a one-character string', () => {
    expect(reverse('a')).toBe('a')
  })

  it('swaps two letters', () => {
    expect(reverse('ab')).toBe('ba')
  })

  it('reverses the characters in a string', () => {
    expect(reverse('hello')).toBe('olleh')
  })

  it('stringifies input', () => {
    expect(reverse(345)).toBe('543')
  })

  it('is on the window object', () => {
    expect(window.reverse).toBe(reverse)
  })
})

describe('curryable', () => {
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

  it('preserves the name of the function', () => {
    let args
    let foo1 = curryable(3, function foo() {})
    expect(foo1.name).toBe('foo')
    expect(foo1(1).name).toBe('foo')
    expect(foo1(1)(2).name).toBe('foo')
  })
})

describe('replace', () => {
  it('replaces one string with another', () => {
    expect(replace('o', 'he', 'wow')).toBe('whew')
  })

  it('replaces all occurrences', () => {
    expect(replace('o', 'y', 'tomato')).toBe('tymaty')
  })

  it('works if the search string is part of the replacement string', () => {
    expect(replace('e', 'ee', 'nevermore')).toBe('neeveermoree')
  })

  it('replaces the first of a set of overlapping matches', () => {
    expect(replace('oo', 'ew', 'coool')).toBe('cewol')
  })

  it('works with regexes', () => {
    expect(replace(/[aeiou]+/, 'w', 'root cellar')).toBe('rwt cwllwr')
  })

  it('curries', () => {
    expect(replace('e', '3')('leet')).toBe('l33t')
  })

  it('is on the window object', () => {
    expect(window.replace).toBe(replace)
  })
})

describe('doWith', () => {
  it('transforms a value using a function', () => {
    let result = doWith('haha', replace('a', 'e'))
    expect(result).toBe('hehe')
  })

  it('returns the value when no functions are given', () => {
    expect(doWith('hello')).toBe('hello')
  })

  it('pipes the value through multiple functions', () => {
    expect(doWith('haha',
      replace('a', 'e'),
      replace('h', 'j'),
      )).toBe('jeje')
  })

  it('is on the window object', () => {
    expect(window.doWith).toBe(doWith)
  })

  it('is aliased to _', () => {
    expect(window._).toBe(doWith)
  })
})

describe('range', () => {
  it('can be empty', () => {
    expect(get(0, range())).not.toBeDefined()
  })

  it('can have one element', () => {
    let range0 = range(0)
    expect(get(0, range0)).toBe(0)
    expect(get(1, range0)).not.toBeDefined()
    expect(count(range0)).toBe(1)

    let range00 = range(0, 0)
    expect(get(0, range00)).toBe(0)
    expect(get(1, range00)).not.toBeDefined()
    expect(count(range00)).toBe(1)
  })

  it('can start anywhere', () => {
    expect(get(0, range(99))).toBe(99)
  })

  it('can have multiple elements', () => {
    let r = range(1, 3)
    expect(get(0, r)).toBe(1)
    expect(get(1, r)).toBe(2)
    expect(get(2, r)).toBe(3)
    expect(get(3, r)).toBe(undefined)
    expect(count(r)).toBe(3)
  })

  it('can be in descending order', () => {
    let r = range(3, 1)
    expect(get(0, r)).toBe(3)
    expect(get(1, r)).toBe(2)
    expect(get(2, r)).toBe(1)
    expect(get(3, r)).toBe(undefined)
    expect(count(r)).toBe(3)
  })

  it('can have negative elements', () => {
    let r = range(-5, 5)
    expect(get(0, r)).toBe(-5)
    expect(get(1, r)).toBe(-4)
    expect(count(r)).toBe(11)
  })

  it('is on the window object', () => {
    expect(window.range).toBe(range)
  })
})

describe('count', () => {
  it('gets the number of elements in an array', () => {
    expect(count([])).toBe(0)
    expect(count([1])).toBe(1)
    expect(count([2, 2, 2])).toBe(3)
  })

  it('gets the number of characters in a string', () => {
    expect(count('')).toBe(0)
    expect(count('a')).toBe(1)
    expect(count('hello')).toBe(5)
  })

  it('is on the window object', () => {
    expect(window.count).toBe(count)
  })
})

describe('get', () => {
  it('gets an array element', () => {
    expect(get(0, [])).toBe(undefined)
    expect(get(0, [1, 2])).toBe(1)
    expect(get(1, [1, 2])).toBe(2)
  })

  it('gets an object property', () => {
    expect(get('a', {})).toBe(undefined)
    expect(get('a', {a: 1})).toBe(1)
  })

  it('is on the window object', () => {
    expect(window.get).toBe(get)
  })
})
