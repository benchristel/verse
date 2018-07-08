import { log, waitForInput, retry } from './effects'
import { has } from './objects'
import { isFunction } from './types'

export * from './action'
export * from './assert'
export * from './effects'
export * from './functionalUtils'
export * from './objects'
export * from './sequences'
export * from './Store'
export * from './types'

export function isTruthy(a) {
  return !!a
}

export function isExactly(a, b) {
  return a === b
}

export function startsWith(prefix, s) {
  return s.indexOf(prefix) === 0
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
