import { isString, isObject, isFunction, isAnything } from './nativeTypes'
import { partialApply } from './higherOrderFunctions'
import { checkArgs, exampleFunctionNamed } from './checkArgs'
import { or } from './predicates'
import { equals } from './functionalUtils'

export function objectsHaveSameKeys(a, b) {
  let aKeys = Object.keys(a)
  let bKeys = Object.keys(b)
  return aKeys.length === bKeys.length && bKeys.every(k => isIn(a, k))
}

const mapObject_interface = {
  example: [
    exampleFunctionNamed('uppercase'),
    {name: 'robin'}
  ],
  types: [isFunction, isObject]
}

export function mapObject(fn, obj) {
  checkArgs(mapObject, arguments, mapObject_interface)
  let result = {}
  for (let key of Object.keys(obj)) {
    result[key] = fn(obj[key])
  }
  return result
}

const hasKey_interface = {
  curry: 2,
  example: ['name', {name: 'elias'}],
  types: [isString, isAnything]
}

export function hasKey(key, obj) {
  checkArgs(hasKey, arguments, hasKey_interface)
  if (arguments.length < 2) return partialApply(hasKey, arguments)
  return Object.prototype.hasOwnProperty.call(obj, key)
}

const hasEntry_interface = {
  curry: 3,
  example: ['name', 'elias', {name: 'elias'}],
  types: [isString, isAnything, isAnything]
}

export function hasEntry(key, value, obj) {
  checkArgs(hasEntry, arguments, hasEntry_interface)
  if (arguments.length < 3) return partialApply(hasEntry, arguments)
  return hasKey(key, obj) && equals(obj[key], value)
}

const has_interface = {
  curry: 3,
  example: ['name', equals('elias'), {name: 'elias'}],
  types: [isString, isFunction, isAnything]
}

export function has(key, predicate, obj) {
  checkArgs(has, arguments, has_interface)
  if (arguments.length < 3) return partialApply(has, arguments)
  return hasKey(key, obj) && predicate(obj[key])
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

export function entries(obj) {
  // Object.entries doesn't guarantee iteration order, so
  // we use Object.keys instead here.
  return Object.keys(obj).map(k => [k, obj[k]])
}
