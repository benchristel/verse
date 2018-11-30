import { has, entries } from './objects'

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

describe('entries', () => {
  it('returns an empty array for an empty object', () => {
    expect(entries({})).toEqual([])
  })

  it('gets key/value pairs, in the order in which they are defined', () => {
    let obj = {a: 1, b: 2, c: 3}
    expect(entries(obj)).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3]
    ])
  })
})
