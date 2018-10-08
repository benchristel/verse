import { isString } from './nativeTypes'
import { abbreviate, functionNamePlaceholder } from './formatting'

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
    : functionNamePlaceholder

  if (args.length) {
    let prettyArgs = [...args].map(abbreviate).join(', ')
    return baseNameStr + '(' + prettyArgs + ')'
  } else {
    return baseNameStr
  }
}
