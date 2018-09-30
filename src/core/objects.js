import { isString, isObject, isFunction } from './nativeTypes'
import { partialApply } from './higherOrderFunctions'
import { checkArgs } from './types'
import { or } from './predicates'

export function objectsHaveSameKeys(a, b) {
  let aKeys = Object.keys(a)
  let bKeys = Object.keys(b)
  return aKeys.length === bKeys.length && bKeys.every(isIn(a))
}

export function mapObject(fn, obj) {
  let result = {}
  for (let key of Object.keys(obj)) {
    result[key] = fn(obj[key])
  }
  return result
}

const has_interface = {
  curry: 2,
  example: ['name', {name: 'elias'}],
  types: [isString, or(isObject, isFunction)]
}

export function has(prop, obj) {
  checkArgs(has, arguments, has_interface)
  if (arguments.length < 2) return partialApply(has, arguments)
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

const isIn_interface = {
  curry: 2,
  example: [{name: 'elias'}, 'name'],
  types: [or(isObject, isFunction), isString]
}

export function isIn(obj, prop) {
  checkArgs(isIn, arguments, isIn_interface)
  if (arguments.length < 2) return partialApply(isIn, arguments)
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
