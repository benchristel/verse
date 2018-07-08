import { lastOf } from './sequences'

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
})
