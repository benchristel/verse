import { isString, isObject, isFunction } from './nativeTypes'

export function curryable(nArgs, fn) {
  return renameFunction(function curryableFn() {
    return arguments.length < nArgs ?
      partialApply(curryableFn, arguments)
      : fn(...arguments)
  }, () => fn.name)
}

export function partialApply(fn, firstArgs) {
  let restOfFn = (...remainingArgs) =>
    fn(...firstArgs, ...remainingArgs)

  let lazyName = () => nameWithArgs(fn.name, firstArgs)
  return renameFunction(restOfFn, lazyName)
}

export function renameFunction(fn, nameCreator) {
  let cache = null
  Object.defineProperty(fn, 'name', {
    get() {
      if (cache === null) {
        cache = nameCreator()
      }
      return cache
    }
  })
  return fn
}

export function nameWithArgs(baseName, args) {
  let baseNameStr = baseName && isString(baseName) ?
    baseName
    : '<function>'

  if (args.length) {
    let prettyArgs = [...args].map(abbreviate).join(', ')
    return baseNameStr + '(' + prettyArgs + ')'
  } else {
    return baseNameStr
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
    return a.name
  }
  return '' + a
}

function quote(s) {
  return '"' + escape(s) + '"'
}

function escape(s) {
  return s
    .split('\\').join('\\\\')
    .split('\n').join('\\n')
    .split('"').join('\\"')
}
