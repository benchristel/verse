window.doWith = doWith
window._ = doWith
export function doWith(subject, ...fns) {
  return fns.reduce((value, f) => f(value), subject)
}

window.uppercase = uppercase
export function uppercase(s) {
  return ('' + s).toUpperCase()
}

window.lowercase = lowercase
export function lowercase(s) {
  return ('' + s).toLowerCase()
}

window.reverse = reverse
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
window.replace = replace

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

window.get = get
export function get(key, collection) {
  return collection[key]
}

window.range = range
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

window.count = count
export function count(collection) {
  return collection.length
}
