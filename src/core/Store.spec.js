import { Store } from './Store'
import { isNumber, isString } from './types'

describe('Store', () => {
  it('generates an initial state from the given type', () => {
    let store = Store({
      a: isString,
      b: {
        x: isNumber,
        y: isNumber
      }
    })
    expect(store.getState()).toEqual({
      a: '',
      b: {
        x: 0,
        y: 0
      }
    })
  })

  it('updates the state via a reducer', () => {
    function reducer(state, action) {
      return state + action.value
    }
    let store = Store(isString, reducer)
    expect(store.getState()).toBe('')
    store.emit({value: 'a'})
    expect(store.getState()).toBe('a')
    store.emit({value: 'b'})
    expect(store.getState()).toBe('ab')
  })

  it('assumes the reducer does not mutate the state', () => {
    function reducer(state) {
      return {x: state.x + 1}
    }
    let store = Store({x: isNumber}, reducer)
    let initialState = store.getState()
    expect(initialState).toEqual({x: 0})
    store.emit()
    expect(store.getState()).toEqual({x: 1})
    expect(initialState).toEqual({x: 0})
  })

  it('throws if the state does not satisfy the type', () => {
    function reducer(state) {
      return ''
    }
    let store = Store(isNumber, reducer)
    expect(store.emit).toThrow()
  })

  it('publishes the state to a subscriber', () => {
    let store = Store(isNumber, n => n + 1)
    let latestState
    store.subscribe(state => latestState = state)
    expect(latestState).not.toBeDefined()
    store.emit()
    expect(latestState).toBe(1)
  })

  it('returns the new state from emit()', () => {
    let store = Store(isNumber, n => n + 1)
    let returned = store.emit()
    expect(returned).toBe(1)
    returned = store.emit()
    expect(returned).toBe(2)
  })
})
