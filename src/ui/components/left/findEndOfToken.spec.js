import { findEndOfToken } from './findEndOfToken'

describe('findEndOfToken', () => {
  it('returns 0 given an empty string', () => {
    expect(findEndOfToken(0, '')).toBe(0)
  })

  it('returns the length of the string when there is only one identifier token', () => {
    expect(findEndOfToken(0, 'abc')).toBe(3)
  })

  it('returns the length of the string when there is only one punctuation token', () => {
    expect(findEndOfToken(0, '===')).toBe(3)
  })

  it('returns the length of the string when the index points to the middle of the only token', () => {
    expect(findEndOfToken(1, '===')).toBe(3)
  })

  it('returns the length of the first word when the index points to the first of two words', () => {
    expect(findEndOfToken(0, 'hello you')).toBe(5)
  })

  it('returns the length of the string when the index points to the space between two words', () => {
    expect(findEndOfToken(6, '01234 abc')).toBe(9)
  })

  it('assumes consecutive punctuation marks are one token', () => {
    expect(findEndOfToken(0, ',,,')).toBe(3)
  })

  it('points to the end of a word followed by punctuation', () => {
    expect(findEndOfToken(0, 'hello,')).toBe(5)
  })

  it('points to the end of punctuation followed by a word', () => {
    expect(findEndOfToken(0, '===whoa')).toBe(3)
  })

  it('does not treat spaces as part of punctuation', () => {
    expect(findEndOfToken(0, '=== ""')).toBe(3)
  })

  it('does not treat other whitespace as part of punctuation', () => {
    expect(findEndOfToken(0, '===\n\t""')).toBe(3)
  })
})
