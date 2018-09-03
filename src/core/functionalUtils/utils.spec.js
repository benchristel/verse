import {
  equals,
  doWith,
  lowercase,
  replace,
  reverse,
  uppercase,
  curryable,
  get,
  range,
  count,
  tuple,
  identity,
  contains,
  nameWithArgs,
  abbreviate,
} from '.'

import '../api'

describe('equals', () => {
  it('compares equal primitives', () => {
    expect(equals(1, 1)).toBe(true)
  })

  it('compares unequal primitives', () => {
    expect(equals(1, 2)).toBe(false)
  })

  it('compares empty arrays', () => {
    expect(equals([], [])).toBe(true)
  })

  it('compares an array to a number', () => {
    expect(equals([], 1)).toBe(false)
  })

  it('compares a number to an array', () => {
    expect(equals(1, [])).toBe(false)
  })

  it('compares arrays of different lengths', () => {
    expect(equals([], [1])).toBe(false)
  })

  it('compares arrays whose elements are the same', () => {
    expect(equals([1, 2, 3], [1, 2, 3])).toBe(true)
  })

  it('compares different arrays with the same length', () => {
    expect(equals([1, 2, 3], [1, 2, 5])).toBe(false)
  })

  it('compares arrays with the same elements in a different order', () => {
    expect(equals([1, 2, 3], [1, 3, 2])).toBe(false)
  })

  it('compares empty objects', () => {
    expect(equals({}, {})).toBe(true)
  })

  it('compares objects of different sizes', () => {
    expect(equals({}, {a: 1})).toBe(false)
  })

  it('compares objects with properties that are equal', () => {
    expect(equals({a: 1}, {a: 1})).toBe(true)
  })

  it('compares objects with different property names', () => {
    expect(equals({a: 1}, {b: 1})).toBe(false)
  })

  it('compares objects with different property values', () => {
    expect(equals({a: 1}, {a: 2})).toBe(false)
  })

  it('compares objects with the same properties in a different order', () => {
    expect(equals({a: 1, b: 2}, {b: 2, a: 1})).toBe(true)
  })

  it('compares equal nested objects', () => {
    expect(equals({a: [{b: 1}]}, {a: [{b: 1}]})).toBe(true)
  })

  it('compares different nested objects', () => {
    expect(equals({a: [{b: 1}]}, {a: [{b: 3}]})).toBe(false)
  })
})

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

  it('curries', () => {
    expect(get('z')({z: 2})).toBe(2)
  })
})

describe('tuple', () => {
  let add1 = x => x + 1
  let double = x => x * 2

  it('transforms a value by each given function, returning a tuple of the results', () => {
    expect(tuple([add1, double], 3)).toEqual([4, 6])
  })

  it('returns an empty tuple given an empty array of transformers', () => {
    expect(tuple([], 1)).toEqual([])
  })

  it('creates a single-element tuple', () => {
    expect(tuple([identity], 1)).toEqual([1])
  })

  it('curries', () => {
    expect(tuple([double, add1])(-1)).toEqual([-2, 0])
  })
})

describe('contains', () => {
  it('is true when searching for an empty string', () => {
    expect(contains('', '')).toBe(true)
    expect(contains('', 'a')).toBe(true)
  })

  it('is false when searching for a nonempty string in an empty string', () => {
    expect(contains('a', '')).toBe(false)
  })

  it('is true when needle === haystack', () => {
    expect(contains('a', 'a')).toBe(true)
  })

  it('is true when the needle begins the haystack', () => {
    expect(contains('a', 'abc')).toBe(true)
  })

  it('is true when the needle ends the haystack', () => {
    expect(contains('c', 'abc')).toBe(true)
  })

  it('curries', () => {
    expect(contains('needle')('hayneedlehay')).toBe(true)
  })
})
