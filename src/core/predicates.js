import { partialApply, renameFunction } from './higherOrderFunctions'

export function or(p, q) {
  if (arguments.length < 2) {
    return partialApply(or, arguments)
  }
  return renameFunction((...args) =>
    p(...args) || q(...args)
  , () => 'or(' + p.name + ', ' + q.name + ')')
}

export function not(predicate) {
  let negated = (...args) => !predicate(...args)
  return renameFunction(negated, () => 'not(' + predicate.name + ')')
}
