import { not, or } from './predicates'
import { isTruthy, doWith } from './index'
import { hasKey } from './objects'

describe('not', () => {
  it('inverts a predicate', () => {
    expect(not(isTruthy)(false)).toBe(true)
  })

  it('takes its name from the predicate', () => {
    expect(not(isTruthy).name).toBe('not(isTruthy)')
  })
})

describe('or', () => {
  let aOrB = or(hasKey('a'), hasKey('b'))

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
    expect(aOrB.name).toBe('or(hasKey("a"), hasKey("b"))')
  })

  it('can be used as an infix', () => {
    let _ = doWith
    aOrB = _(hasKey('a'), or(hasKey('b')))
    expect(aOrB({a: 1})).toBe(true)
    expect(aOrB({b: 1})).toBe(true)
    expect(aOrB({})).toBe(false)
    expect(aOrB.name)
      .toBe('or(hasKey("b"), hasKey("a"))')
  })

  it('nests', () => {
    let _ = doWith
    let abc = _(
      hasKey('a'),
      or(hasKey('b')),
      or(hasKey('c'))
    )
    expect(abc({a: 1})).toBe(true)
    expect(abc({b: 1})).toBe(true)
    expect(abc({c: 1})).toBe(true)
    expect(abc({})).toBe(false)
  })
})
