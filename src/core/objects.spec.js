import { hasKey, hasEntry, has, entries } from './objects'

describe('hasKey', () => {
  it('returns true if the object has the property', () => {
    expect(hasKey('a', {a: 1})).toBe(true)
  })

  it('returns false if not', () => {
    expect(hasKey('a', {})).toBe(false)
  })

  it('sees properties that have no value', () => {
    expect(hasKey('a', {a: undefined})).toBe(true)
  })

  it('ignores inherited properties', () => {
    let parent = {a: 1}
    let child = Object.create(parent)
    expect(hasKey('a', child)).toBe(false)
  })

  it('autocurries', () => {
    expect(hasKey('a')({a: 1})).toBe(true)
  })
})

describe('hasEntry', () => {
  it('returns true if the object has the entry', () => {
    expect(hasEntry('a', 1, {a: 1})).toBe(true)
  })

  it('returns false if not', () => {
    expect(hasEntry('a', 1, {})).toBe(false)
  })

  it('returns false if the object has the key but not the value', () => {
    expect(hasEntry('a', 1, {a: 2})).toBe(false)
  })

  it('returns false if the object has the value but not the key', () => {
    expect(hasEntry('a', 1, {b: 1})).toBe(false)
  })

  it('compares values by value, not by identity', () => {
    expect(hasEntry('a', [], {a: []})).toBe(true)
  })

  it('curries', () => {
    expect(hasEntry('a')(1)({a: 1})).toBe(true)
  })
})

describe('has', () => {
  const isNot = a => b => a !== b

  it('returns true if the object has an entry matching the predicate', () => {
    expect(has('a', isNot(1), {a: 2})).toBe(true)
  })

  it('returns false if the entry does not match the predicate', () => {
    expect(has('a', isNot(1), {a: 1})).toBe(false)
  })

  it('returns false if the entry is not present', () => {
    expect(has('a', isNot(1), {})).toBe(false)
  })

  it('curries', () => {
    expect(has('a')(isNot(1))({a: 2})).toBe(true)
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
