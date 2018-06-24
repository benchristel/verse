import './api'

describe('isIterator', () => {
  it('is false for a function', () => {
    expect(isIterator(() => {})).toBe(false)
  })

  it('is true for a generator iterator', () => {
    function *gen() {}
    expect(isIterator(gen())).toBe(true)
  })

  it('is false for a generator function', () => {
    function *gen() {}
    expect(isIterator(gen)).toBe(false)
  })
})
