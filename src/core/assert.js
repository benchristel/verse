import { visualize } from './formatting'
import { indent } from './strings'
import { isArray, isFunction, isAnything } from './nativeTypes'
import { checkArgs, exampleFunctionNamed } from './checkArgs'

const assert_interface = {
  variadic: true,
  example: ['foo', exampleFunctionNamed('equals'), 'bar'],
  types: [isAnything, isFunction, isArray]
}

export function assert(subject, predicate, ...args) {
  checkArgs(assert, arguments, assert_interface)
  let matches = predicate(...args, subject)
  if (!matches) throw new Error('Tried to assert that\n'
      + indent(visualize(subject)) + '\n'
      + predicate.name + '\n'
      + indent(args.map(visualize).join(', ')))
}
