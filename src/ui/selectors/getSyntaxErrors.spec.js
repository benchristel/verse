import { getSyntaxErrors } from './getSyntaxErrors'
import reducer from '../reducers'
import { loadFiles, display } from '../actions'

describe('getSyntaxErrors', () => {
  it('is empty when no files are loaded', () => {
    let state = reducer({}, {type: 'noop'})
    expect(getSyntaxErrors(state)).toEqual([])
  })

  it('finds a syntax error', () => {
    let state = reducer({}, loadFiles({'main.js': 'foo'}))
    state = reducer(state, display({
      logLines: [],
      displayLines: [],
      inputLines: [],
      error: null,
      syntaxErrors: {'main.js': new Error('uh oh')}
    }))
    expect(getSyntaxErrors(state)).toEqual([
      {
        file: 'main.js',
        error: expect.objectContaining({message: 'uh oh'})
      }
    ])
  })

  it('is empty when no files have syntax errors', () => {
    let state = reducer({}, loadFiles({'main.js': 'foo'}))
    state = reducer(state, display({
      logLines: [],
      displayLines: [],
      inputLines: [],
      error: null,
      syntaxErrors: {}
    }))
    expect(getSyntaxErrors(state)).toEqual([])
  })
})
