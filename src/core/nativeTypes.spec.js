import { isObject, isArray } from './nativeTypes'

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
