export function doWith(subject, ...fns) {
  return fns.reduce((value, f) => f(value), subject)
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

export let replace = curryable(3,
  function replace(pattern, replacement, subject) {
    return subject.split(pattern).join(replacement)
  }
)

export function firstOf(a) {
  return a[0]
}

export function restOf(a) {
  return a.slice(1)
}

export function curryable(nArgs, fn) {
  let curryableFn = {[fn.name]: function() {
    if (arguments.length < nArgs) {
      return partialApply(curryableFn, arguments, fn.name)
    }
    return fn(...arguments)
  }}[fn.name]
  return curryableFn
}

window.partialApply = partialApply
export function partialApply(fn, firstArgs, name) {
  return {[name]: (...remainingArgs) =>
    fn(...firstArgs, ...remainingArgs)
  }[name]
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
}

export function get(key, collection) {
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
