import { anySyntaxErrors } from './anySyntaxErrors'
import { loadFiles, display } from '../actions'
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
    state = reducer(state, display({
      logLines: [],
      displayLines: [],
      inputLines: [],
      error: null,
      syntaxErrors: {'foo.js': new Error('uh oh')}
    }))
    expect(anySyntaxErrors(state)).toBe(true)
  })
})
