import { partialApply } from './functionalUtils'

export * from './functionalUtils'
export * from './action'

export function App(global) {
  let {
    viewTestResults,
    getStateType,
    reducer,
    view,
    init,
  } = global

  if (!view) throw 'You must define a view() function at the top level'
  if (!getStateType) getStateType = () => ({})
  if (!init) init = function*() {}

  let results = runTests(getTestFunctions(global))
  if (results.failures.length) {
    viewTestResults(results)
    return NullBard()
  }

  let store = Store(getStateType(), reducer)
  const bard = Bard(store, view)
  bard.begin(init)

  return bard
}

export function NullBard() {
  return {
    begin() {},
    receiveKeydown() {},
    interrupt() {},
    stop() {},
    redraw() {},
  }
}

export function Bard(store, view) {
  let stack = []
  let waitingForChar = false
  let waitTimeout = null

  return {
    begin,
    receiveKeydown,
    interrupt,
    stop,
    redraw,
  }

  function begin(generator) {
    push(generator)
    run()
  }

  function receiveKeydown({key}) {
    if (!waitingForChar) return
    run(key)
  }

  function interrupt(signal = SIGNAL_INTERRUPTED) {
    clearTimeout(waitTimeout)
    run(signal)
  }

  function stop() {
    while (stack.length) pop()
  }

  function redraw() {
    updateScreen()
  }

  function run(returnFromYield) {
    try {
      return tryRun(returnFromYield)
    } catch (e) {
      view.error(translateError(e))
    }
  }

  function tryRun(returnFromYield) {
    waitingForChar = false
    waitTimeout = null
    let saga

    if (!stack.length) return
    let {value: effect, done} = lastOf(stack).next(returnFromYield)

    if (done) {
      pop()
      run(effect)
      return
    }

    if (isGeneratorFunction(effect)) {
      push(effect)
      run()
      return
    }

    switch (effect.effectType) {
      case 'waitForChar':
      updateScreen()
      waitingForChar = true
      return

      case 'wait':
      updateScreen()
      waitTimeout = setTimeout(run, effect.seconds * 1000)
      return

      case 'startTimer':
      let interval = setInterval(callAndRender(effect.callback), effect.seconds * 1000)
      lastOf(stack).timers.push(interval)
      run()
      return

      case 'jump':
      while (stack.length) pop()
      push(effect.generator)
      run()
      return

      case 'retry':
      saga = pop()
      push(saga.generator)
      run()
      return

      case 'log':
      view.log(effect.message)
      run()
      return

      case 'startDisplay':
      saga = lastOf(stack)
      saga.render = effect.render
      updateScreen()
      run()
      return

      case 'startInputDisplay':
      saga = lastOf(stack)
      saga.inputRender = effect.render
      updateScreen()
      run()
      return

      default:
      view.error(new Error('You `yield`ed something weird: ' + JSON.stringify(effect)))
      return
    }
  }

  function push(generator) {
    let saga = generator(store.emit)
    saga.timers = []
    saga.generator = generator
    saga.render = null
    saga.inputRender = null
    stack.push(saga)
  }

  function pop() {
    updateScreen()
    let saga = stack.pop()
    saga.timers.forEach(clearInterval)
    return saga
  }

  function updateScreen() {
    let render, inputRender, i
    for (i = stack.length - 1; i >= 0; i--) {
      if (!render && stack[i].render) {
        render = stack[i].render
      }
      if (!inputRender && stack[i].inputRender) {
        inputRender = stack[i].inputRender
      }
      if (render && inputRender) break;
    }

    if (render) view.screen(render(store.getState()))
    if (inputRender) view.input(inputRender(store.getState()))
  }

  function callAndRender(fn) {
    return function() {
      fn()
      updateScreen()
    }
  }
}

const SIGNAL_INTERRUPTED = {
  toString() {
    return 'INTERRUPTED'
  }
}

window.wait = wait
export function wait(seconds) {
  return {
    effectType: 'wait',
    seconds
  }
}

window.waitForChar = waitForChar
export function waitForChar() {
  return {
    effectType: 'waitForChar'
  }
}

window.waitForInput = waitForInput
export function waitForInput(prompt='') {
  return function*() {
    let entered = ''
    yield startInputDisplay(() => {
      return [
        prompt,
        '> ' + entered + '_'
      ]
    })
    yield function*() {
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
      yield retry()
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

window.jump = jump
export function jump(generator) {
  return {
    effectType: 'jump',
    generator
  }
}

window.retry = retry
export function retry() {
  return {
    effectType: 'retry'
  }
}

window.log = log
export function log(message) {
  return {
    effectType: 'log',
    message
  }
}

window.startDisplay = startDisplay
export function startDisplay(render) {
  return {
    effectType: 'startDisplay',
    render
  }
}

window.startInputDisplay = startInputDisplay
export function startInputDisplay(render) {
  return {
    effectType: 'startInputDisplay',
    render
  }
}

window.lastOf = lastOf
export function lastOf(list) {
  return list[list.length - 1]
}

window.isTruthy = isTruthy
export function isTruthy(a) {
  return !!a
}

window.isExactly = isExactly
export function isExactly(a, b) {
  return a === b
}

window.has = has
export function has(prop, obj) {
  if (arguments.length < 2) return partialApply(has, arguments, 'has(' + prop + ')')
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

window.isIn = isIn
export function isIn(obj, prop) {
  if (arguments.length < 2) return partialApply(isIn, arguments)
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

window.startsWith = startsWith
export function startsWith(prefix, s) {
  return s.indexOf(prefix) === 0
}

window.not = not
export function not(predicate) {
  let name = 'not(' + predicate.name + ')'
  return {[name]: (...args) => !predicate(...args)}[name]
}

window.isEmpty = isEmpty
export function isEmpty(a) {
  for (let item of a) return false && item // make linter happy
  return true
}

window.isString = isString
export function isString(a) {
  return typeof a === 'string'
}

window.isNumber = isNumber
export function isNumber(a) {
  return a === +a
}

window.isObject = isObject
export function isObject(a) {
  return Object.prototype.toString.call(a) === '[object Object]'
}

window.isGeneratorFunction = isGeneratorFunction
export function isGeneratorFunction(a) {
  return Object.prototype.toString.call(a) === '[object GeneratorFunction]'
}

window.isFunction = isFunction
export function isFunction(a) {
  return typeof a === 'function'
}

window.or = or
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

export function translateError(error) {
  if (
    // webkit
    (error instanceof RangeError && error.message === 'Maximum call stack size exceeded')
    // moz
    || (error.message === 'too much recursion')) {
    error.message = 'Too many retry() calls. Is there an infinite loop?'
  }
  return error
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
  return function *() {
    let input = yield waitForInput()
    if (!isFunction(window[inputProcessorName])) {
      throw new Error('' + inputProcessorName + ' is not a function')
    }
    yield log(window[inputProcessorName](input))
    yield retry()
  }
}
