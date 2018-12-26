import { routine } from './routines'
import { isIterator } from './nativeTypes'

describe('routine', () => {
  it('creates an iterable', () => {
    let r = routine(function*() {
      yield 1
      yield 2
      yield 3
    })

    expect(isIterator(r())).toBe(true)
    let items = [...r()]
    expect(items).toEqual([1, 2, 3])
  })

  it('passes arguments to the underlying generator', () => {
    let r = routine(function*(start, end) {
      for (let i = start; i < end; i++) {
        yield i
      }
    })

    let items = [...r(6, 9)]
    expect(items).toEqual([6, 7, 8])
  })

  it('passes through return values from the underlying generator', () => {
    let r = routine(function*() {
      return 'it works'
    })
    expect(r().next().value).toBe('it works')
  })

  it('throws errors from the underlying generator', () => {
    let r = routine(function*() {
      throw Error('uh oh')
    })

    expect(() => {
      [...r()]
    }).toThrowError('uh oh')
  })

  it('appends the name of the routine to a verseStack property on thrown errors', () => {
    let r = routine(function*r() {
      yield *s()
    })

    let s = routine(function*s() {
      throw Error('yikes')
    })

    let error
    try {
      [...r()]
    } catch (e) {
      error = e
    }
    expect(error.verseStack).toEqual(['s', 'r'])
  })

  it('keeps a pointer to the routine on the call object', () => {
    let r = routine(function*() {})
    expect(r().routine).toBe(r)
  })

  it('keeps the argument list on the call object', () => {
    let r = routine(function*() {})
    expect(r('hello', 1).args).toEqual(['hello', 1])
  })

  it('is idempotent', () => {
    let r = routine(function*() {})
    expect(routine(r)).toBe(r)
  })
})
