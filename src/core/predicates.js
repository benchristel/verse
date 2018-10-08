import { partialApply, renameFunction } from './higherOrderFunctions'
import { isString, isNumber, isFunction } from'./nativeTypes'
import { checkArgs } from './checkArgs'

const or_interface = {
  curry: 2,
  example: [isString, isNumber],
  types: [isFunction, isFunction]
}

export function or(p, q) {
  checkArgs(or, arguments, or_interface)
  if (arguments.length < or_interface.curry) {
    return partialApply(or, arguments)
  }
  return renameFunction((...args) =>
    p(...args) || q(...args)
  , () => 'or(' + p.name + ', ' + q.name + ')')
}

export function not(predicate) {
  let negated = (...args) => !predicate(...args)
  return renameFunction(negated, () => 'not(' + predicate.name + ')')
}
