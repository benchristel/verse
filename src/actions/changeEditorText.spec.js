import reducer from '../reducers'
import { loadFiles, changeEditorText } from './index'

describe('changeEditorText', () => {
  let state
  beforeEach(() => {
    state = reducer({}, {type: 'noop'})
  })

  function dispatch(action) {
    state = reducer(state, action)
  }

  it('changes the text of the current file', () => {
    dispatch(loadFiles({'main.js': 'yoink'}))
    dispatch(changeEditorText('changed', 'main.js'))

    expect(state.files['main.js'].text).toBe('changed')
  })

  it('preserves other properties of the file', () => {
    dispatch(loadFiles({'main.js': 'yoink'}))
    state.files['main.js'].other = 'something'
    dispatch(changeEditorText('changed', 'main.js'))

    expect(state.files['main.js'].other).toBe('something')
  })

  it('preserves other files', () => {
    dispatch(loadFiles({'foo': 'bar', 'baz': 'quux'}))
    dispatch(changeEditorText('changed', 'foo'))

    expect(state.files['foo'].text).toBe('changed')
    expect(state.files['baz'].text).toBe('quux')
  })
})
