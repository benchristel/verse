import reducer from '../reducers'
import { showErrorPanel } from './showErrorPanel'
import { hideErrorPanel } from './hideErrorPanel'

describe('hideErrorPanel', () => {
  it('hides the error panel', () => {
    let state = reducer({}, {type: 'noop'})
    state = reducer(state, showErrorPanel())
    expect(reducer(state, hideErrorPanel()).isErrorPanelShown).toBe(false)
  })
})
