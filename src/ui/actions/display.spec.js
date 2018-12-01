import reducer from '../reducers'
import { display } from '../actions'
import { blankView } from '../../core/view'

describe('display', () => {
  let state
  beforeEach(() => {
    state = reducer({}, {type: 'noop'})
  })

  function dispatch(action) {
    state = reducer(state, action)
  }

  it('hides the error panel if there are no errors', () => {
    state.isErrorPanelShown = true
    dispatch(display(blankView()))

    expect(state.isErrorPanelShown).toBe(false)
  })

  it('does not hide the error panel if there is a runtime error', () => {
    state.isErrorPanelShown = true
    dispatch(display({
      syntaxErrors: {},
      error: 'bloop',
      displayLines: [],
      testResults: {},
      form: [],
      formId: 0,
    }))

    expect(state.isErrorPanelShown).toBe(true)
  })

  it('does not hide the error panel if there are syntax errors', () => {
    state.isErrorPanelShown = true
    dispatch(display({
      syntaxErrors: {foo: 'bar'},
      error: null,
      displayLines: [],
      testResults: {},
      form: [],
      formId: 0,
    }))

    expect(state.isErrorPanelShown).toBe(true)
  })
})
