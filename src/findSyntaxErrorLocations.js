import { parse } from 'acorn'

export function findSyntaxErrorLocations(code) {
  try {
    parse(code)
    return []
  } catch (e) {
    return [{
      line:   e.loc.line - 1,
      column: e.loc.column,
      pos:    e.pos
    }]
  }
}
