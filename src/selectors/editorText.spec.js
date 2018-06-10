import { editorText } from './editorText'
import reducer from '../reducers'
import { loadFiles } from '../actions'

describe('editorText', () => {
  it('is blank when no files are loaded', () => {
    let state = reducer({}, {type: 'noop'})
    expect(editorText(state)).toBe('')
  })

  it('gets the text of main.js', () => {
    let state = reducer({}, loadFiles({'main.js': 'foo'}))
    expect(editorText(state)).toBe('foo')
  })
})
