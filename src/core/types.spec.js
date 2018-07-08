import { not, or, isEmpty, isObject } from './types'
import { has } from './objects'
import { isTruthy } from './index'

describe('not', () => {
  it('inverts a predicate', () => {
    expect(not(isTruthy)(false)).toBe(true)
  })

  it('takes its name from the predicate', () => {
    expect(not(isTruthy).name).toBe('not(isTruthy)')
  })
})

describe('or', () => {
  let aOrB = or(has('a'), has('b'))

  it('returns true when the first predicate applies', () => {
    expect(aOrB({a: 1})).toBe(true)
  })

  it('returns true when the second predicate applies', () => {
    expect(aOrB({b: 1})).toBe(true)
  })

  it('returns false when neither predicate applies', () => {
    expect(aOrB({})).toBe(false)
  })

  it('returns true when both predicates apply', () => {
    expect(aOrB({a: 1, b: 1})).toBe(true)
  })

  it('takes its name from the predicates', () => {
    expect(aOrB.name).toBe('or(has(a), has(b))')
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
