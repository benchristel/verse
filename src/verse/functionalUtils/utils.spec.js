import {
  lowercase,
  reverse,
  uppercase,
} from '.'

describe('uppercase', () => {
  it('does nothing to the empty string', () => {
    expect(uppercase('')).toBe('')
  })

  it('upcases alphabetic characters', () => {
    expect(uppercase('hello there')).toBe('HELLO THERE')
  })

  it('stringifies input', () => {
    expect(uppercase(1)).toBe('1')
  })

  it('is on the window object', () => {
    expect(window.uppercase).toBe(uppercase)
  })
})

describe('lowercase', () => {
  it('does nothing to the empty string', () => {
    expect(lowercase('')).toBe('')
  })

  it('upcases alphabetic characters', () => {
    expect(lowercase('YIKIES')).toBe('yikies')
  })

  it('stringifies input', () => {
    expect(lowercase(1)).toBe('1')
  })

  it('is on the window object', () => {
    expect(window.lowercase).toBe(lowercase)
  })
})

describe('reverse', () => {
  it('does nothing to the empty string', () => {
    expect(reverse('')).toBe('')
  })

  it('does nothing to a one-character string', () => {
    expect(reverse('a')).toBe('a')
  })

  it('swaps two letters', () => {
    expect(reverse('ab')).toBe('ba')
  })

  it('reverses the characters in a string', () => {
    expect(reverse('hello')).toBe('olleh')
  })

  it('stringifies input', () => {
    expect(reverse(345)).toBe('543')
  })

  it('is on the window object', () => {
    expect(window.reverse).toBe(reverse)
  })
})
