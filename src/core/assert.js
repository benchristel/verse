import { visualize } from './functionalUtils'
import { indent } from './strings'
import { equals } from './functionalUtils'
import { isArray, isFunction, isAnything } from './nativeTypes'
import { checkArgs } from './types'

const assert_interface = {
  variadic: true,
  example: ['foo', equals, 'bar'],
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
