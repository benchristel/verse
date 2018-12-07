import { isObject, isArray, isIterator } from './nativeTypes'

describe('isObject', () => {
  it('returns true for an [object Object]', () => {
    expect(isObject({})).toBe(true)
  })

  it('returns false for an array', () => {
    expect(isObject([])).toBe(false)
  })

  it('returns false for null', () => {
    expect(isObject(null)).toBe(false)
  })

  it('returns false for a regex', () => {
    expect(isObject(/a/)).toBe(false)
  })
})

describe('isArray', () => {
  it('returns true for an array', () => {
    expect(isArray([])).toBe(true)
  })

  it('returns false for an object', () => {
    expect(isArray({})).toBe(false)
  })
})

describe('isIterator', () => {
  it('is false for a function', () => {
    expect(isIterator(() => {})).toBe(false)
  })

  it('is true for a generator iterator', () => {
    function *gen() {}
    expect(isIterator(gen())).toBe(true)
  })

  it('is false for a generator function', () => {
    function *gen() {}
    expect(isIterator(gen)).toBe(false)
  })
})
