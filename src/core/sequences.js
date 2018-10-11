import { isArray, isString } from './nativeTypes'
import { checkArgs } from './checkArgs'
import { or } from './predicates'
import { partialApply } from './higherOrderFunctions'

const lastOf_interface = {
  example: [[1, 2, 3]],
  types: [or(isArray, isString)]
}

export function lastOf(list) {
  checkArgs(lastOf, arguments, lastOf_interface)
  return list[list.length - 1]
}

export function map(fn, seq) {
  if (arguments.length < 2) {
    return partialApply(map, arguments)
  }
  if (seq.length === 0) return seq
  return seq.map((item) => fn(item))
}
