import { isArray, isString } from './nativeTypes'
import { checkArgs } from './types'
import { or } from './predicates'

const lastOf_interface = {
  example: [[1, 2, 3]],
  types: [or(isArray, isString)]
}

export function lastOf(list) {
  checkArgs(lastOf, arguments, lastOf_interface)
  return list[list.length - 1]
}
