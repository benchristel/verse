import { partialApply } from './functionalUtils'

export * from './functionalUtils'
export * from './action'

export function wait(seconds) {
  return {
    effectType: 'wait',
    seconds
  }
}

export function waitForever() {
  return {
    effectType: 'waitForever'
  }
}

export function waitForChar() {
  return {
    effectType: 'waitForChar'
  }
}

export function waitForInput(prompt='') {
  return function*() {
    let entered = ''
    yield startInputDisplay(() => {
      return [
        prompt,
        '> ' + entered + '_'
      ]
    })
    yield function* getOneChar() {
      let c = yield waitForChar()
      switch (c) {
        case 'Enter':
        return;

        case 'Backspace':
        entered = entered.slice(0, entered.length - 1)
        break;

        default:
        entered += c
      }
      yield retry(getOneChar)
    }
    // TODO: empty string here is a hack to work around
    // the UI's awkward display implementation.
    yield startInputDisplay(() => [''])
    return entered
  }
}

window.startTimer = startTimer
export function startTimer(seconds, callback) {
  return {
    effectType: 'startTimer',
    seconds,
    callback
  }
}

export function jump(generator) {
  return {
    effectType: 'jump',
    generator
  }
}

window.retry = retry
export function retry(generator) {
  return {
    effectType: 'retry',
    generator
  }
}

export function log(message) {
  return {
    effectType: 'log',
    message
  }
}

export function startDisplay(render) {
  return {
    effectType: 'startDisplay',
    render
  }
}

export function startInputDisplay(render) {
  return {
    effectType: 'startInputDisplay',
    render
  }
}

export function perform(action) {
  return {
    effectType: 'perform',
    action
  }
}

export function lastOf(list) {
  return list[list.length - 1]
}

export function isTruthy(a) {
  return !!a
}

export function isExactly(a, b) {
  return a === b
}

export function has(prop, obj) {
  if (arguments.length < 2) return partialApply(has, arguments, 'has(' + prop + ')')
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export function isIn(obj, prop) {
  if (arguments.length < 2) return partialApply(isIn, arguments)
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export function startsWith(prefix, s) {
  return s.indexOf(prefix) === 0
}

export function not(predicate) {
  let name = 'not(' + predicate.name + ')'
  return {[name]: (...args) => !predicate(...args)}[name]
}

export function isEmpty(a) {
  for (let item of a) return false && item // make linter happy
  return true
}

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

export function or(p, q) {
  let name = 'or(' + p.name + ', ' + q.name + ')'
  return {[name]: (...args) =>
    p(...args) || q(...args)
  }[name]
}

export function Store(type, reducer) {
  let state = getDefaultValue(type)
  let subscriber_ = () => {}

  return {
    getState,
    emit,
    subscribe
  }

  function getState() {
    return state
  }

  function emit(action) {
    let newState = reducer(state, action)
    _expect(newState, satisfies, type)
    state = newState
    subscriber_(newState)
    return newState
  }

  function subscribe(subscriber) {
    subscriber_ = subscriber
  }
}

// leading underscore prevents conflict with Jasmine's expect()
export function _expect(subject, predicate, ...params) {
  if (!predicate) {
    throw new Error('expect() requires a function as the second argument')
  }
  if (!predicate(...params, subject)) {
    throw {
      subject, predicate, params,
      toString() {
        return 'Expected that ' + subject + ' ' + predicate.name + ' ' + params.join(', ')
      }
    }
  }
}

export function assert(subject, predicate, ...args) {
  let matches = predicate(subject, ...args)
  if (!matches) throw new Error('Asserted that\n'
      + '  ' + subject + '\n'
      + predicate.name + '\n'
      + '  ' + args.join(', '))

}

export function runTests(tests) {
  let failures = tests
    .map(getFailure)
    .filter(isTruthy)

  return {failures, totalTestsRun: tests.length}

  function getFailure(test) {
    try {
      test()
    } catch (failure) {
      return failure
    }
    return null
  }
}

export function getTestFunctions(global) {
  return Object.values(global)
    .filter(isTruthy)
    .filter(has('name'))
    .filter(({name}) => startsWith('test_', name))
}

export function defaultingTo(defaultValue, predicate) {
  if (defaultValue === undefined) throw 'Type must have a default value'
  if (!predicate(defaultValue)) throw 'Given default value does not satisfy the type'

  let theType = (...args) => predicate(...args)

  theType.defaultValue = defaultValue
  return theType
}


export function oneOf(...values) {
  _expect(values, not(isEmpty))
  let theType = v => values.includes(v)
  theType.defaultValue = values[0]
  return theType
}

export function mapObject(fn, obj) {
  let result = {}
  for (let key of Object.keys(obj)) {
    result[key] = fn(obj[key])
  }
  return result
}

export function objectsHaveSameKeys(a, b) {
  let aKeys = Object.keys(a)
  let bKeys = Object.keys(b)
  return aKeys.length === bKeys.length && bKeys.every(isIn(a))
}

export function satisfies(type, value) {
  if (arguments.length < 2) return partialApply(satisfies, arguments)
  if (value && value._verse_type === type) return true
  if (typeof type === 'function') return type(value)
  _expect(type, isObject)
  if (!isObject(value)) return false
  if (!objectsHaveSameKeys(type, value)) return false
  for (let key of Object.keys(type)) {
    if (!satisfies(type[key], value[key])) return false
  }
  Object.defineProperty(value, '_verse_type', {value: type, writable: true})
  return true
}

export function getDefaultValue(type) {
  if (isObject(type)) return mapObject(getDefaultValue, type)
  if (has('defaultValue', type)) return type.defaultValue

  let likelyDefaults = [null, [], 0, '']
  let value = likelyDefaults.find(type)
  if (value === undefined) throw 'No default value for type'
  return value
}

export function isArrayOf(type) {
  return a => Array.isArray(a) && a.every(satisfies(type))
}

export function isNullOr(type) {
  return a => a === null || satisfies(type, a)
}

window.echo = echo
export function echo(inputProcessorName) {
  return function* loop() {
    let input = yield waitForInput()
    if (!isFunction(window[inputProcessorName])) {
      throw new Error('' + inputProcessorName + ' is not a function')
    }
    yield log(window[inputProcessorName](input))
    yield retry(loop)
  }
}
