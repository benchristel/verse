import reducer from '../reducers'
import { switchFile } from '.'

describe('switchFile', () => {
  let state
  beforeEach(() => {
    state = reducer({}, {type: 'noop'})
  })

  function dispatch(action) {
    state = reducer(state, action)
  }

  it('shows the new file in the editor', () => {
    dispatch(switchFile('changed'))
    expect(state.currentlyEditingFile).toBe('changed')
  })
})
