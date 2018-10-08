import { visualize, abbreviate } from './formatting'

describe('visualize', () => {
  it('represents numbers as strings', () => {
    expect(visualize(1)).toBe('1')
    expect(visualize(2.5)).toBe('2.5')
    expect(visualize(-4)).toBe('-4')
    expect(visualize(1e21)).toBe('1e+21')
  })

  it('represents null as "null"', () => {
    expect(visualize(null)).toBe('null')
  })

  it('represents undefined as "undefined"', () => {
    expect(visualize()).toBe('undefined')
  })

  it('represents booleans as "true" and "false"', () => {
    expect(visualize(true)).toBe('true')
    expect(visualize(false)).toBe('false')
  })

  it('represents the empty string as a pair of quotes', () => {
    expect(visualize('')).toBe('""')
  })

  it('quotes strings', () => {
    expect(visualize('a')).toBe('"a"')
  })

  it('escapes special chars in strings', () => {
    expect(visualize('a"b')).toBe('"a\\"b"')
  })

  it('puts slashes around regexes', () => {
    expect(visualize(/[a-z]+/)).toBe('/[a-z]+/')
  })

  it('escapes literal slashes in regexes', () => {
    expect(visualize(/http:\/\//)).toBe('/http:\\/\\//')
  })

  it('represents an empty array as []', () => {
    expect(visualize([])).toBe('[]')
  })

  it('represents an array with one element inline', () => {
    expect(visualize([1])).toBe('[1]')
  })

  it('puts elements of longer arrays on separate lines', () => {
    expect(visualize([1, 2])).toBe('[\n  1,\n  2\n]')
  })

  it('recursively visualizes array elements', () => {
    expect(visualize(['a'])).toBe('["a"]')
    expect(visualize(['hi', {}])).toBe('[\n  "hi",\n  {}\n]')
  })

  it('represents an empty object as {}', () => {
    expect(visualize({})).toBe('{}')
  })

  it('represents an object with one property inline', () => {
    expect(visualize({foo: 1})).toBe('{"foo": 1}')
  })

  it('puts properties of larger objects on separate lines', () => {
    expect(visualize({foo: 1, bar: 2}))
      .toBe('{\n  "foo": 1,\n  "bar": 2\n}')
  })

  it('nests long objects and arrays', () => {
    let expected = `{
  "foo": [
    1,
    2,
    3
  ],
  "bar": 0
}`
    expect(visualize({foo: [1, 2, 3], bar: 0})).toBe(expected)
  })

  it('nests a long array in a short object with one level of indentation', () => {
    let expected = `{"hi": [
  "fizz",
  "buzz"
]}`
    expect(visualize({hi: ['fizz', 'buzz']})).toBe(expected)
  })

  it('avoids infinite recursion of objects', () => {
    let a = {}
    a.a = a
    expect(visualize(a)).toBe('{"a": <circular reference>}')
  })

  it('allows DAGs of objects', () => {
    let a = {}
    let b = {a1: a, a2: a}
    expect(visualize(b)).toBe('{\n  "a1": {},\n  "a2": {}\n}')

    /* check that objects with multiple keys (in this case,
     * b) are popped off the stack correctly.
     */
    let c = {b1: b, b2: b}
    expect(visualize(c)).toBe(`{
  "b1": {
    "a1": {},
    "a2": {}
  },
  "b2": {
    "a1": {},
    "a2": {}
  }
}`)
  })

  it('avoids infinite recursion of arrays', () => {
    let a = []
    a.push(a)
    expect(visualize(a)).toBe('[<circular reference>]')
  })

  it('allows DAGs of arrays', () => {
    let a = []
    let b = [a, a]
    let c = [b, b]
    expect(visualize(c)).toBe(`[
  [
    [],
    []
  ],
  [
    [],
    []
  ]
]`)
  })

  it('displays the names of functions', () => {
    let hasMethods = {
      noop() {}
    }

    expect(visualize(hasMethods)).toBe('{"noop": noop}')
  })

  it('displays <function> for anonymous functions', () => {
    expect(visualize(() => {})).toBe('<function>')
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
