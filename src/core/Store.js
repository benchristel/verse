import { getDefaultValue, satisfies } from './types'
import { assert } from './assert'

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
    assert(newState, satisfies, type)
    state = newState
    subscriber_(newState)
    return newState
  }

  function subscribe(subscriber) {
    subscriber_ = subscriber
  }
}
