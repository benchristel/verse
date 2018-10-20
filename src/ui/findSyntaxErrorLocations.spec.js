import { findSyntaxErrorLocations } from './findSyntaxErrorLocations'

describe("findSyntaxErrorLocations", () => {
  it('returns an empty array when there is no error', () => {
    expect(findSyntaxErrorLocations('')).toEqual([])
    expect(findSyntaxErrorLocations('1 + 1')).toEqual([])
  })

  it('returns the zero-indexed line and column of the error when there is one', () => {
    expect(findSyntaxErrorLocations('}')).toEqual([{line: 0, column: 0, pos: 0}])
    expect(findSyntaxErrorLocations(' }')).toEqual([{line: 0, column: 1, pos: 1}])
    expect(findSyntaxErrorLocations('\n}')).toEqual([{line: 1, column: 0, pos: 1}])
  })

  it('tolerates trailing commas', () => {
    expect(findSyntaxErrorLocations('foo(1,)')).toEqual([])
  })
})
