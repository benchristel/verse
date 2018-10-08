import { isEmpty, getDefaultValue } from './types'

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
