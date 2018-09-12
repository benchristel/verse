import { isString, isFunction, isArray, isObject, isRegExp } from '../nativeTypes'
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

const isAnything = () => true
const isArrayOfFunctions = isArrayOf(isFunction)

const doWith_example = ['hello', uppercase, reverse]
export function doWith(subject, ...fns) {
  checkArgs(doWith, arguments, {
    variadic: true,
    example: doWith_example,
    types: [
      subject, isAnything,
      fns,     isArrayOfFunctions
    ],
  })

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

const replace_example = ['i', 'ello', 'Hi there!']
export function replace(pattern, replacement, subject) {
  const nArgs = 3
  checkArgs(replace, arguments, {
    curry: nArgs,
    example: replace_example,
    types: [
      pattern,     or(isString, isRegExp),
      replacement, isString,
      subject,     isString
    ],
  })
  if (arguments.length < nArgs) {
    return partialApply(replace, arguments)
  }

  return subject.split(pattern).join(replacement)
}

export function firstOf(a) {
  return a[0]
}

export function restOf(a) {
  return a.slice(1)
}

export function get(key, collection) {
  if (arguments.length < 2) {
    return partialApply(get, arguments)
  }
  return collection[key]
}

export function range(start, end) {
  if (end === undefined) return [start]

  if (end > start) {
    let items = []
    for (let i = start; i <= end; i++) items.push(i)
    return items
  } else {
    // descending order
    let items = []
    for (let i = start; i >= end; i--) items.push(i)
    return items
  }
}

export function count(collection) {
  return collection.length
}

export function isTruthy(a) {
  return !!a
}

export function isExactly(a, b) {
  return a === b
}

export function startsWith(prefix, s) {
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

export function contains(needle, haystack) {
  if (arguments.length < 2) {
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
