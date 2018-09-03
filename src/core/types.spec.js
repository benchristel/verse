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

  it('returns true for an empty Set', () => {
    expect(isEmpty(new Set())).toBe(true)
  })

  it('returns false for an array with one item', () => {
    expect(isEmpty([1])).toBe(false)
  })

  it('returns false for a Set with one item', () => {
    expect(isEmpty(new Set([1]))).toBe(false)
  })
})
