function App(global) {
  const {
    viewTestResults,
    getStateType,
    reducer,
    view,
    init,
  } = global

  if (!view) throw 'You must define a view() function at the top level'

  let results = runTests(getTestFunctions(global))
  if (results.failures.length) {
    viewTestResults(results)
    return NullBard()
  }

  let store = Store(getStateType(), reducer)
  bard = Bard(store, view)
  bard.begin(init)

  return bard
}
function NullBard() {
  return {
    begin() {},
    receiveKeydown() {},
    interrupt() {},
    stop() {}
  }
}

function Bard(store, view) {
  let stack = []
  let waitingForChar = false
  let waitTimeout = null

  return {
    begin,
    receiveKeydown,
    interrupt,
    stop
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

  function run(returnFromYield) {
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
      throw 'You `yield`ed something weird: ' + JSON.stringify(effect)
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
function wait(seconds) {
  return {
    effectType: 'wait',
    seconds
  }
}

function waitForChar() {
  return {
    effectType: 'waitForChar'
  }
}

function waitForInput() {
  return function*(tell) {
    let result = '', a
    while((a = yield waitForChar()) !== 'Enter')
      result += a
    return result
  }
}

function startTimer(seconds, callback) {
  return {
    effectType: 'startTimer',
    seconds,
    callback
  }
}

function jump(generator) {
  return {
    effectType: 'jump',
    generator
  }
}

function retry() {
  return {
    effectType: 'retry'
  }
}

function log(message) {
  return {
    effectType: 'log',
    message
  }
}

function startDisplay(render) {
  return {
    effectType: 'startDisplay',
    render
  }
}

function startInputDisplay(render) {
  return {
    effectType: 'startInputDisplay',
    render
  }
}
function lastOf(list) {
  return list[list.length - 1]
}
function partialApply(fn, firstArgs, name) {
  return {[name]: (...remainingArgs) =>
    fn(...firstArgs, ...remainingArgs)
  }[name]
}
function isTruthy(a) {
  return !!a
}

function isExactly(a, b) {
  return a === b
}

function has(prop, obj) {
  if (arguments.length < 2) return partialApply(has, arguments, `has(${prop})`)
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function isIn(obj, prop) {
  if (arguments.length < 2) return partialApply(isIn, arguments)
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function startsWith(prefix, s) {
  return s.indexOf(prefix) === 0
}

function not(predicate) {
  let name = 'not(' + predicate.name + ')'
  return {[name]: (...args) => !predicate(...args)}[name]
}

function isEmpty(a) {
  for (let item of a) return false
  return true
}

function isString(a) {
  return typeof a === 'string'
}

function isNumber(a) {
  return a === +a
}

function isObject(a) {
  return Object.prototype.toString.call(a) === '[object Object]'
}

function isGeneratorFunction(a) {
  return Object.prototype.toString.call(a) === '[object GeneratorFunction]'
}

function or(p, q) {
  let name = `or(${p.name}, ${q.name})`
  return {[name]: (...args) =>
    p(...args) || q(...args)
  }[name]
}
function Store(type, reducer) {
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
  }

  function subscribe(subscriber) {
    subscriber_ = subscriber
  }
}
// leading underscore prevents conflict with Jasmine's expect()
function _expect(subject, predicate, ...params) {
  if (!predicate) throw 'expect() requires a function as the second argument'
  if (!predicate(...params, subject)) {
    throw {
      subject, predicate, params,
      toString() {
        return `Expected that ${subject} ${predicate.name} ${params.join(', ')}`
      }
    }
  }
}

function runTests(tests) {
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

function getTestFunctions(global) {
  return Object.values(global)
    .filter(isTruthy)
    .filter(has('name'))
    .filter(({name}) => startsWith('test_', name))
}
function defaultingTo(defaultValue, predicate) {
  if (defaultValue === undefined) throw 'Type must have a default value'
  if (!predicate(defaultValue)) throw 'Given default value does not satisfy the type'

  let theType = (...args) => predicate(...args)

  theType.defaultValue = defaultValue
  return theType
}

function oneOf(...values) {
  _expect(values, not(isEmpty))
  let theType = v => values.includes(v)
  theType.defaultValue = values[0]
  return theType
}

function mapObject(fn, obj) {
  let result = {}
  for (let key of Object.keys(obj)) {
    result[key] = fn(obj[key])
  }
  return result
}

function objectsHaveSameKeys(a, b) {
  let aKeys = Object.keys(a)
  let bKeys = Object.keys(b)
  return aKeys.length === bKeys.length && bKeys.every(isIn(a))
}

function satisfies(type, value) {
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

function getDefaultValue(type) {
  if (isObject(type)) return mapObject(getDefaultValue, type)
  if (has('defaultValue', type)) return type.defaultValue

  let likelyDefaults = [null, [], 0, '']
  let value = likelyDefaults.find(type)
  if (value === undefined) throw 'No default value for type'
  return value
}

function isArrayOf(type) {
  return a => Array.isArray(a) && a.every(satisfies(type))
}

function isNullOr(type) {
  return a => a === null || satisfies(type, a)
}
