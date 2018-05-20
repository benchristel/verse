function unknown() {
  function proxyTarget() {
    return unknown()
  }

  proxyTarget.__verseUnknown__ = true

  proxyTarget.toString = function() {
    return 'unknown'
  }

  proxyTarget[Symbol.toPrimitive] = proxyTarget.toString

  return new Proxy(proxyTarget, {
    get(target, property) {
      return target[property] || unknown()
    }
  })
}

function isUnknown(thing) {
  return thing && thing.__verseUnknown__ || false
}

describe('unknown', () => {
  it('is not equal to any other unknown value', () => {
    expect(unknown()).not.toBe(unknown())
  })

  it('stringifies as "unknown"', () => {
    expect('' + unknown()).toBe('unknown')
  })

  it('mathifies as NaN', () => {
    expect(unknown() - 0).toBeNaN()
    expect(unknown() * 1).toBeNaN()
    expect(unknown() / 1).toBeNaN()
    expect(unknown() % 1).toBeNaN()
    expect(Math.pow(unknown, 2)).toBeNaN()
    expect(Math.pow(2, unknown)).toBeNaN()
  })

  it('can be detected', () => {
    expect(isUnknown(unknown())).toBe(true)
  })

  it('is not mistakable for undefined or null', () => {
    expect(isUnknown(undefined)).toBe(false)
    expect(isUnknown(null)).toBe(false)
  })

  it('is not mistakable for any other object', () => {
    expect(isUnknown({})).toBe(false)
    expect(isUnknown('unknown')).toBe(false)
  })

  it('responds with unknown when asked for a specific property', () => {
    expect(isUnknown(unknown().foo)).toBe(true)
  })

  it('responds with unknown when you call it like a function', () => {
    expect(isUnknown(unknown()())).toBe(true)
  })

  it('responds with unknown when you call a method on it', () => {
    expect(isUnknown(unknown().cowabunga())).toBe(true)
  })
})
