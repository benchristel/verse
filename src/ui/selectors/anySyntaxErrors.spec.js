import { anySyntaxErrors } from './anySyntaxErrors'
import { loadFiles, display } from '../actions'
import { blankView } from '../../core/view'
import reducer from '../reducers'

describe('anySyntaxErrors', () => {
  it('is false when there are no files', () => {
    let state = reducer({}, {type: 'noop'})
    expect(anySyntaxErrors(state)).toBe(false)
  })

  it('is false when there are no syntax errors', () => {
    let state = reducer({}, loadFiles({
      'foo.js': 'hi',
      'bar.js': 'whoa'
    }))
    expect(anySyntaxErrors(state)).toBe(false)
  })

  it('is true when one file has a syntax error', () => {
    let state = reducer({}, loadFiles({
      'foo.js': 'hi',
      'bar.js': 'whoa'
    }))
    let view = {
      ...blankView(),
      syntaxErrors: {'foo.js': new Error('uh oh')}
    }
    state = reducer(state, display(view))
    expect(anySyntaxErrors(state)).toBe(true)
  })
})
