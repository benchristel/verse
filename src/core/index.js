import { has } from './objects'
import { isTruthy, startsWith } from './functionalUtils'

export * from './action'
export * from './assert'
export * from './effects'
export * from './functionalUtils'
export * from './objects'
export * from './sequences'
export * from './Store'
export * from './types'
export * from './Core.js'

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
