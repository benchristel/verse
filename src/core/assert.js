export function assert(subject, predicate, ...args) {
  let matches = predicate(...args, subject)
  if (!matches) throw new Error('Tried to assert that\n'
      + '  ' + subject + '\n'
      + predicate.name + '\n'
      + '  ' + args.join(', '))
}

export function assertArgs(argsMap) {
  for (let key in argsMap) {
    let [value, type] = argsMap[key]
    if (!type(value)) {
      throw Error(`Tried to assert that argument ${key} ${type.name}, but got\n${value}`)
    }
  }
}
