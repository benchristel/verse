import { isString, isArray, isObject, isFunction } from './nativeTypes'
import { indent, quote } from './strings'

export const functionNamePlaceholder = '<function>'

export function visualize(a) {
  const circularRefStr = '<circular reference>'
  let stack = []
  return recurse(a)

  function recurse(a) {
    if (isString(a))
      return quote(a)
    else if (isArray(a)) {
      if (stack.indexOf(a) > -1) return circularRefStr
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
      if (stack.indexOf(a) > -1) return circularRefStr
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
      return a.name || functionNamePlaceholder
    }
    else return '' + a
  }
}

export function abbreviate(a) {
  if (isString(a)) {
    return quote(
      a.length > 10 ?
        a.slice(0, 10) + '...'
        : a
    )
  } else if (isObject(a)) {
    for (let k in a) return '{...}'
    return '{}'
  } else if (Array.isArray(a)) {
    if (a.length) return '[...]'
    return '[]'
  } else if (typeof a === 'symbol') {
    return 'Symbol()'
  } else if (isFunction(a)) {
    return a.name || functionNamePlaceholder
  }
  return '' + a
}

export function asText(value) {
  return isString(value) ? value : visualize(value)
}
