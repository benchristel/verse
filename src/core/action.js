import { checkArgs } from './checkArgs'
import { isArrayOf } from './types'
import { isString } from './nativeTypes'

const action_interface = {
  variadic: true,
  example: ['name', 'highScore'],
  types: [isArrayOf(isString)]
}

export function action(...argNames) {
  checkArgs(action, arguments, action_interface)
  let fn = function(...args) {
    let obj = {}
    for (let i = 0; i < argNames.length; i++) {
      obj[argNames[i]] = args[i]
    }
    obj.type = fn
    return obj
  }
  fn.generatedByVerse = true
  return fn
}
