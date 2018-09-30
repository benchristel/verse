import { partialApply, abbreviate } from './higherOrderFunctions'
import { not, or } from './predicates'
import { has, mapObject, objectsHaveSameKeys } from './objects'
import { assert } from './assert'
import { isObject, isString, isArray } from './nativeTypes'
import { visualize } from './functionalUtils'

export function satisfies(type, value) {
  if (arguments.length < 2) return partialApply(satisfies, arguments)
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

export function checkArgs(fn, args, spec) {
  function pointsToValidArg(i) {
    return i < spec.types.length && i < args.length
  }

  function curryingMessage() {
    return spec.curry && args.length < spec.curry ?
      ['', `Note that this function supports partial application, so it is OK to supply fewer than ${spec.curry} arguments.`]
      : []
  }

  function variadicMessage() {
    return spec.variadic ?
      ['', `Note that this function can be called with any number of arguments >= ${spec.types.length - 1}.`]
      : []
  }

  function message() {
    return [
      `The \`${fn.name}\` function was called with unexpected arguments:`,
      '',
      `  ${fn.name}(${[...args].map(abbreviate).join(', ')})`,
      '',
      'It expected something like:',
      '',
      `  ${fn.name}(${spec.example.map(visualize).join(', ')})`,
      ...curryingMessage(),
      ...variadicMessage()
    ].join('\n')
  }

  for (let i = 0; pointsToValidArg(i); i++) {
    let arg  = args[i]
    let type = spec.types[i]
    if (spec.variadic && i === spec.types.length - 1) {
      // the last type of a variadic type signature should
      // be an isArrayOf() type that will match the spread
      // args passed to the function.
      if (!satisfies(type, [...args].slice(i))) {
        throw Error(message())
      }
    } else if (!satisfies(type, arg)) {
      throw Error(message())
    }
  }
}
