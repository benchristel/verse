import { lastOf, map } from './sequences'

describe('lastOf', function() {
  it('returns undefined for an empty array', () => {
    expect(lastOf([])).not.toBeDefined()
  })

  it('returns the only element of a one-element array', () => {
    expect(lastOf([5])).toBe(5)
  })

  it('returns the last element of a longer array', () => {
    expect(lastOf([5, 6, 7])).toBe(7)
  })

  it('works on strings', () => {
    expect(lastOf('abc')).toBe('c')
  })
})

describe('map', function() {
  function testFn(item) {
    return item + 1
  }

  it('returns an empty array unchanged', () => {
    let a = []
    expect(map(testFn, a)).toBe(a)
  })

  it('transforms each array item', () => {
    expect(map(testFn, [1])).toEqual([2])
    expect(map(testFn, [1, 2, 3])).toEqual([2, 3, 4])
  })

  it('curries', () => {
    expect(map(testFn)([1])).toEqual([2])
  })
})
