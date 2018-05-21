import { syntaxErrorLocations } from './syntaxErrorLocations'

describe("syntaxErrorLocations", () => {
  it('returns an empty array when there is no error', () => {
    expect(syntaxErrorLocations('')).toEqual([])
    expect(syntaxErrorLocations('1 + 1')).toEqual([])
  })

  it('returns the zero-indexed line and column of the error when there is one', () => {
    expect(syntaxErrorLocations('}')).toEqual([{line: 0, column: 0, pos: 0}])
    expect(syntaxErrorLocations(' }')).toEqual([{line: 0, column: 1, pos: 1}])
    expect(syntaxErrorLocations('\n}')).toEqual([{line: 1, column: 0, pos: 1}])
  })
})
