import { Core } from './Core'
import './api'

describe('Core', () => {
  let core, view
  beforeEach(() => {
    core = Core()
  })

  afterEach(() => {
    core.clean()
  })

  const helloWorld = `
    define({
      displayText() {
        return 'hello world'
      }
    })
  `

  it('can define a "hello world" program', () => {
    core.run()
    view = core.deploy('main.js', helloWorld)
    expect(view.displayLines).toEqual(['hello world'])
  })

  it('outputs all the display components', () => {
    core.run()
    let view = core.deploy('main.js', helloWorld)
    expect(view).toEqual({
      logLines: [],
      displayLines: ['hello world'],
      inputLines: [],
      error: null,
      syntaxErrors: {},
      form: null,
    })
  })

  it('cleans up', () => {
    core.run()
    core.deploy('main.js', helloWorld)
    expect(window.displayText).toBeDefined()
    core.clean()
    expect(window.displayText).not.toBeDefined()
  })

  it('does not run code if not explicitly requested to run', () => {
    core.deploy('main.js', 'window.sideEffect = true')
    expect(window.sideEffect).not.toBeDefined()
  })

  it('DOES run code if requested after the code is deployed', () => {
    core.deploy('main.js', helloWorld)
    core.run()
    expect(view.displayLines).toEqual(['hello world'])
  })

  it('reports an error if one of the modules fails to eval', () => {
    core.deploy('main.js', helloWorld + '}') // syntax error!
    let view = core.run()
    expect(view.syntaxErrors['main.js'].toString()).toContain('SyntaxError')
  })

  it('hot-swaps code', () => {
    core.run()
    core.deploy('main.js', helloWorld)
    let view = core.deploy('main.js', helloWorld.replace('hello world', 'changed'))
    expect(view.displayLines).toEqual(['changed'])
  })

  it('does not reinstate the old version of a function after hot-swap and restart', () => {
    core.deploy('main.js', helloWorld)
    core.run()
    core.deploy('main.js', helloWorld.replace('hello world', 'changed'))
    view = core.run()
    expect(view.displayLines).toEqual(['changed'])
  })

  const echo = `
    define({
      *run() {
        let input = yield waitForInput()
        yield log(input)
      }
    })
  `

  it('runs an interactive app', () => {
    core.deploy('main.js', echo)
    view = core.run()
    expect(view.inputLines).toEqual([
      '',
      '> _'
    ])
    view = typeKeys('abc')
    expect(view.inputLines).toEqual([
      '',
      '> abc_'
    ])
    view = core.receiveKeydown({key: 'Enter'})
    expect(view.logLines).toEqual(['abc'])
    expect(view.inputLines).toEqual([])
  })

  it('hot-swaps interactive code', () => {
    const munge = `
      define({
        munge(input) { return input },

        *run() {
          let input = yield waitForInput()
          yield log(munge(input))
        }
      })
    `

    core.deploy('main.js', munge)
    core.run()
    core.deploy('main.js', munge.replace('return input', 'return reverse(input)'))
    typeKeys('abc')
    view = core.receiveKeydown({key: 'Enter'})
    expect(view.logLines).toEqual(['cba'])
  })

  it('runs an app that uses the store', () => {
    core.deploy('main.js', `
      define({
        getStateType() {
          return isNumber
        },

        reducer(state) {
          return state + 1
        },

        *run() {
          yield startDisplay(state => [state])
          yield wait(1)
          yield perform({})
          yield perform({})
          yield perform({})
          yield wait(1)
        }
      })
    `)
    view = core.run()
    expect(view.displayLines).toEqual([0])
    view = core.tickFrames(60)
    expect(view.displayLines).toEqual([3])
  })

  it('outputs the stack trace on a crash', () => {
    core.deploy('main.js', `
      define({
        *run() {
          yield *hey()
        },

        *hey() {
          blargh()
        }
      })
    `)
    view = core.run()
    expect(view.error.verseStack).toEqual(['hey', 'run'])
  })

  it('does not clear syntax errors when a restart of the app is requested', () => {
    core.run()
    view = core.deploy('main.js', 'syntax error')
    expect(view.syntaxErrors['main.js']).toBeDefined()
    view = core.run()
    expect(view.syntaxErrors['main.js']).toBeDefined()
  })

  function typeKeys(text) {
    let v = view
    for (let ch of text) v = core.receiveKeydown({key: ch})
    return v
  }
})
