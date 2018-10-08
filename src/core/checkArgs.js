import { abbreviate, visualize } from './formatting'

export function checkArgs(fn, args, spec) {
  function optionalArgs() {
    return spec.optionalArgs || 0
  }

  function minArgs() {
    if (spec.curry) return 0
    if (spec.variadic) return spec.types.length - 1
    return spec.types.length - optionalArgs()
  }

  function maxArgs() {
    if (spec.variadic) return Infinity
    return spec.types.length
  }

  function pointsToValidArg(i) {
    return i < spec.types.length && i < args.length
  }

  function curryingMessage() {
    return spec.curry && args.length < spec.curry ?
      ['', `Note that this function supports partial application, so it is OK to supply fewer than ${spec.curry} arguments.`]
      : []
  }

  function variadicMessage() {
    return spec.variadic ?
      ['', `Note that this function can be called with any number of arguments >= ${minArgs()}.`]
      : []
  }

  function message() {
    return [
      `The \`${fn.name}\` function was called with unexpected arguments:`,
      '',
      `  ${fn.name}(${[...args].map(abbreviate).join(', ')})`,
      '',
      'It expected something like:',
      '',
      `  ${fn.name}(${spec.example.map(visualize).join(', ')})`,
      ...curryingMessage(),
      ...variadicMessage()
    ].join('\n')
  }

  if (args.length > maxArgs() || args.length < minArgs()) {
    throw Error(message())
  }

  for (let i = 0; pointsToValidArg(i); i++) {
    let arg  = args[i]
    let type = spec.types[i]
    if (spec.variadic && i === spec.types.length - 1) {
      // the last type of a variadic type signature should
      // be an isArrayOf() type that will match the spread
      // args passed to the function.
      if (!type([...args].slice(i))) {
        throw Error(message())
      }
    } else if (!type(arg)) {
      throw Error(message())
    }
  }
}

export function exampleFunctionNamed(name) {
  let fn = function() {}
  Object.defineProperty(fn, 'name', {
    get() { return name }
  })
  return fn
}
