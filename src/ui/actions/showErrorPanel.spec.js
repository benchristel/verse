import reducer from '../reducers'
import { showErrorPanel } from './showErrorPanel'

describe('showErrorPanel', () => {
  it('shows the error panel', () => {
    let actions = [
      {type: 'noop'},
      showErrorPanel()
    ]
    let state = actions.reduce(reducer, {})

    expect(state.isErrorPanelShown).toBe(true)
  })
})
