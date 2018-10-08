import { partialApply } from './higherOrderFunctions'
import { not, or } from './predicates'
import { has, mapObject, objectsHaveSameKeys } from './objects'
import { assert } from './assert'
import { isObject, isString, isArray, isFunction, isAnything } from './nativeTypes'
import { checkArgs } from './checkArgs'

const satisfies_interface = {
  curry: 2,
  example: [{name: isString}, {name: 'Elias'}],
  types: [or(isObject, isFunction), isAnything]
}

export function satisfies(type, value) {
  checkArgs(satisfies, arguments, satisfies_interface)
  return uncheckedSatisfies.apply(null, arguments)
}

/* checkArgs needs a version of `satisfies` it can call
 * without causing infinitely recursive typechecking. */
function uncheckedSatisfies(type, value) {
  if (arguments.length < satisfies_interface.curry) {
    return partialApply(uncheckedSatisfies, arguments)
  }
  if (value && value._verse_type === type) return true
  if (typeof type === 'function') return type(value)
  assert(type, isObject)
  if (!isObject(value)) return false
  if (!objectsHaveSameKeys(type, value)) return false
  for (let key of Object.keys(type)) {
    if (!satisfies(type[key], value[key])) return false
  }
  Object.defineProperty(value, '_verse_type', {value: type, writable: true})
  return true
}

export function getDefaultValue(type) {
  if (isObject(type)) return mapObject(getDefaultValue, type)
  if (has('defaultValue', type)) return type.defaultValue

  let likelyDefaults = [null, [], 0, '']
  let value = likelyDefaults.find(type)
  if (value === undefined) throw new Error('No default value for type')
  return value
}

export function isArrayOf(type, value) {
  if (arguments.length < 2) return partialApply(isArrayOf, arguments)
  return Array.isArray(value) && value.every(satisfies(type))
}

export function isNullOr(type) {
  return a => a === null || satisfies(type, a)
}

export function oneOf(...values) {
  assert(values, not(isEmpty))
  let theType = v => values.includes(v)
  theType.defaultValue = values[0]
  return theType
}

const isEmpty_interface = {
  example: [[]],
  types: [or(or(isString, isArray), isObject)]
}

export function isEmpty(a) {
  checkArgs(isEmpty, arguments, isEmpty_interface)
  if (isObject(a)) {
    for (let key in a) return false && key
    return true
  }
  for (let item of a) return false && item // make linter happy
  return true
}

export function defaultingTo(defaultValue, predicate) {
  if (defaultValue === undefined) throw new Error('Type must have a default value')
  if (!predicate(defaultValue)) throw new Error('Given default value does not satisfy the type')

  let theType = (...args) => predicate(...args)

  theType.defaultValue = defaultValue
  return theType
}
