import { partialApply } from './functionalUtils'
import { assert, _expect } from './assert'
import { getDefaultValue, satisfies, isFunction } from './types'
import { log, waitForInput, retry } from './effects'
import { has } from './objects'

export * from './action'
export * from './assert'
export * from './effects'
export * from './functionalUtils'
export * from './objects'
export * from './types'

export function lastOf(list) {
  return list[list.length - 1]
}

export function isTruthy(a) {
  return !!a
}

export function isExactly(a, b) {
  return a === b
}

export function startsWith(prefix, s) {
  return s.indexOf(prefix) === 0
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
