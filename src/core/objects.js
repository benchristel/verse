import { partialApply } from './functionalUtils'

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

export function has(prop, obj) {
  if (arguments.length < 2) return partialApply(has, arguments, 'has(' + prop + ')')
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export function isIn(obj, prop) {
  if (arguments.length < 2) return partialApply(isIn, arguments)
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
