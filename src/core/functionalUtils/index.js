import { isString, isFunction, isArray, isObject, isRegExp, isNumber, isAnything } from '../nativeTypes'
import { partialApply } from '../higherOrderFunctions'
import { isArrayOf, checkArgs } from '../types'
import { or } from '../predicates'
import { quote, indent } from '../strings'

export function equals(a, b) {
  if (a instanceof Array) {
    if (!(b instanceof Array)) {
      return false
    }

    if (a.length !== b.length) {
      return false
    }

    return a.every((elem, i) => equals(elem, b[i]))
  }

  if (a instanceof Object) {
    let aKeys = Object.keys(a)

    if (aKeys.length !== Object.keys(b).length) {
      return false
    }

    return aKeys.every(key => equals(a[key], b[key]))
  }

  return a === b
}

const doWith_interface = {
  variadic: true,
  example: ['hello', uppercase, reverse],
  types: [
    isAnything,
    isArrayOf(isFunction)
  ],
}
export function doWith(subject, ...fns) {
  checkArgs(doWith, arguments, doWith_interface)

  return fns.reduce((value, f) => {
    return f(value)
  }, subject)
}

export function uppercase(s) {
  return ('' + s).toUpperCase()
}

export function lowercase(s) {
  return ('' + s).toLowerCase()
}

export function reverse(s) {
  s = '' + s
  if (s.length < 2) return s
  return reverse(restOf(s)) + firstOf(s)
}

const replace_interface = {
  curry: 3,
  example: ['i', 'ello', 'Hi there!'],
  types: [
    or(isString, isRegExp),
    isString,
    isString
  ],
}
export function replace(pattern, replacement, subject) {
  checkArgs(replace, arguments, replace_interface)
  if (arguments.length < replace_interface.curry) {
    return partialApply(replace, arguments)
  }

  return subject.split(pattern).join(replacement)
}

const firstOf_restOf_interface = {
  example: ['abc'],
  types: [
    or(isString, isArray)
  ]
}

export function firstOf(a) {
  checkArgs(firstOf, arguments, firstOf_restOf_interface)
  return a[0]
}

export function restOf(a) {
  checkArgs(firstOf, arguments, firstOf_restOf_interface)
  return a.slice(1)
}

const get_interface = {
  curry: 2,
  example: ['key', {key: 'value'}],
  types: [
    or(isString, isNumber),
    isAnything
  ]
}

export function get(key, collection) {
  checkArgs(get, arguments, get_interface)
  if (arguments.length < get_interface.curry) {
    return partialApply(get, arguments)
  }
  return collection[key]
}

const range_interface = {
  example: [1, 10],
  types: [isNumber, isNumber]
}

export function range(start, end) {
  checkArgs(range, arguments, range_interface)
  if (end < start) throw Error('Expected arguments to range() to be in ascending order, but got: ' + start + ', ' + end)

  let items = []
  for (let i = start; i <= end; i++) items.push(i)
  return items
}

const count_interface = {
  example: [[1, 2, 3]],
  types: [or(isArray, isString)]
}

export function count(collection) {
  checkArgs(count, arguments, count_interface)
  return collection.length
}

export function isTruthy(a) {
  return !!a
}

export function isExactly(a, b) {
  return a === b
}

const startsWith_interface = {
  example: ['y', 'yes'],
  types: [isString, isString]
}

export function startsWith(prefix, s) {
  checkArgs(startsWith, arguments, startsWith_interface)
  return s.indexOf(prefix) === 0
}

export function tuple(transformers, value) {
  if (arguments.length < 2) {
    return partialApply(tuple, arguments)
  }
  return transformers.map(t => t(value))
}

export function identity(a) {
  return a
}

const contains_interface = {
  curry: 2,
  example: ['ee', 'green cheese'],
  types: [isAnything, or(isString, isArray)]
}

export function contains(needle, haystack) {
  checkArgs(contains, arguments, contains_interface)
  if (arguments.length < contains_interface.curry) {
    return partialApply(contains, arguments)
  }
  return haystack.indexOf(needle) > -1
}

export function visualize(a) {
  const circularRefStr = '<circular reference>'
  let stack = []
  return recurse(a)

  function recurse(a) {
    if (isString(a))
      return quote(a)
    else if (isArray(a)) {
      if (contains(a, stack)) return circularRefStr
      stack.push(a)
      let innards = a.map(recurse).join(',\n')
      if (a.length > 1) {
        stack.pop()
        return '[\n' + indent(innards) + '\n]'
      }
      else {
        stack.pop()
        return '[' + innards + ']'
      }
    }
    else if (isObject(a)) {
      if (contains(a, stack)) return circularRefStr
      stack.push(a)
      let keys = Object.keys(a)
      let innards = keys
        .map(k => quote(k) + ': ' + recurse(a[k]))
        .join(',\n')
      if (keys.length > 1) {
        stack.pop()
        return '{\n' + indent(innards) + '\n}'
      }
      else {
        stack.pop()
        return '{' + innards + '}'
      }
    }
    else if (isFunction(a)) {
      return a.name || '<function>'
    }
    else return '' + a
  }
}
