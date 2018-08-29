export function assert(subject, predicate, ...args) {
  let matches = predicate(...args, subject)
  if (!matches) throw new Error('Tried to assert that\n'
      + '  ' + subject + '\n'
      + predicate.name + '\n'
      + '  ' + args.join(', '))
}

// TODO: remove _expect and use assert consistently
export function _expect(subject, predicate, ...params) {
  if (!predicate) {
    throw new Error('expect() requires a function as the second argument')
  }
  if (!predicate(...params, subject)) {
    let error = {
      subject, predicate, params,
      toString() {
        return 'Expected that ' + subject + ' ' + predicate.name + ' ' + params.join(', ')
      }
    }

    throw error
  }
}
