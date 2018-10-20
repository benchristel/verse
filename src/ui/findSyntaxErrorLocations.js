import { Parser } from 'acorn'

export function findSyntaxErrorLocations(code) {
  try {
    new Parser({ecmaVersion: 8}, code, 0).parse()
    return []
  } catch (e) {
    return [{
      line:   e.loc.line - 1,
      column: e.loc.column,
      pos:    e.pos
    }]
  }
}
