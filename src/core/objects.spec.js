import { has } from './objects'

describe('has', () => {
  it('returns true if the object has the property', () => {
    expect(has('a', {a: 1})).toBe(true)
  })

  it('returns false if not', () => {
    expect(has('a', {})).toBe(false)
  })

  it('sees properties that have no value', () => {
    expect(has('a', {a: undefined})).toBe(true)
  })

  it('ignores inherited properties', () => {
    let parent = {a: 1}
    let child = Object.create(parent)
    expect(has('a', child)).toBe(false)
  })

  it('autocurries', () => {
    expect(has('a')({a: 1})).toBe(true)
  })
})
