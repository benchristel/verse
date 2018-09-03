export function isString(a) {
  return typeof a === 'string'
}

export function isNumber(a) {
  return a === +a
}

export function isObject(a) {
  return Object.prototype.toString.call(a) === '[object Object]'
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
