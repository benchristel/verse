export function isString(a) {
  return typeof a === 'string'
}

export function isNumber(a) {
  return a === +a
}

export function isObject(a) {
  return Object.prototype.toString.call(a) === '[object Object]'
}

export function isArray(a) {
  return Array.isArray(a)
}

export function isGeneratorFunction(a) {
  return Object.prototype.toString.call(a) === '[object GeneratorFunction]'
}

export function isIterator(a) {
  return Object.prototype.toString.call(a) === '[object Generator]'
}

export function isFunction(a) {
  return typeof a === 'function'
}

export function isRegExp(a) {
  return Object.prototype.toString.call(a) === '[object RegExp]'
}
