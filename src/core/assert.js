import { visualize } from './functionalUtils'
import { indent } from './strings'

export function assert(subject, predicate, ...args) {
  let matches = predicate(...args, subject)
  if (!matches) throw new Error('Tried to assert that\n'
      + indent(visualize(subject)) + '\n'
      + predicate.name + '\n'
      + indent(args.map(visualize).join(', ')))
}
