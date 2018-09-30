import { isArray } from './nativeTypes'
import { checkArgs } from './types'

const lastOf_interface = {
  example: [[1, 2, 3]],
  types: [isArray]
}

export function lastOf(list) {
  checkArgs(lastOf, arguments, lastOf_interface)
  return list[list.length - 1]
}
