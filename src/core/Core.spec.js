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
      error: null,
      syntaxErrors: {},
      testResults: {},
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
    expect(view.displayLines).toEqual([
      '',
      '> _'
    ])
    view = typeKeys('abc')
    expect(view.displayLines).toEqual([
      '',
      '> abc_'
    ])
    view = core.receiveKeydown({key: 'Enter'})
    expect(view.logLines).toEqual(['abc'])
    expect(view.displayLines).toEqual(['Finished.'])
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
    expect(view.displayLines).toEqual(['0'])
    view = core.tickFrames(60)
    expect(view.displayLines).toEqual(['3'])
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

  it('runs tests when the code starts running', () => {
    core.deploy('main.js', `
      define({
        testMe() {
          return 'broken'
        },

        'test testMe'() {
          assert(testMe(), is, 'it works')
        }
      })
    `)
    view = core.run()
    expect(view.testResults).toEqual({
      'test testMe': new Error('Tried to assert that\n  "broken"\nis\n  "it works"')
    })
  })

  it('runs tests when new code is deployed', () => {
    core.run()
    let main = `
      define({
        testMe() {
          return 'broken'
        },

        'test testMe'() {
          assert(testMe(), is, 'it works')
        }
      })
    `
    view = core.deploy('main.js', main)
    expect(view.testResults).toEqual({
      'test testMe': new Error('Tried to assert that\n  "broken"\nis\n  "it works"')
    })
    view = core.deploy('main.js', replace('broken', 'it works', main))
    expect(view.testResults).toEqual({
      'test testMe': null
    })
  })

  it('keeps the test results when the app is restarted', () => {
    core.run()
    let main = `
      define({
        testMe() {
          return 'broken'
        },

        'test testMe'() {
          assert(testMe(), is, 'it works')
        }
      })
    `
    core.deploy('main.js', main)
    view = core.run()
    expect(view.testResults).toEqual({
      'test testMe': new Error('Tried to assert that\n  "broken"\nis\n  "it works"')
    })
  })

  it('records errors thrown from getStateType', () => {
    let main = `
      define({
        getStateType() {
          throw Error('bork')
        }
      })

    `
    core.deploy('main.js', main)
    view = core.run()
    expect(view.error).toEqual(Error('bork'))
  })

  it('records errors thrown from state type predicates', () => {
    let main = `
      define({
        getStateType() {
          return () => {
            throw Error('bork')
          }
        }
      })
    `
    core.deploy('main.js', main)
    view = core.run()
    expect(view.error).toEqual(Error('bork'))
  })

  it('does not allow user-defined functions to be called while a module is being loaded', () => {
    core.deploy('main.js', `
      define({
        flipArgs(fn) {
          return (a, b) => fn(b, a)
        }
      })
    `)
    view = core.run()
    expect(view.error).toBeNull()
    view = core.deploy('main.js', `
      define({
        flipArgs(fn) {
          return (a, b) => fn(b, a)
        },

        funkyDiv: flipArgs((a, b) => a / b)
      })
    `)
    expect(view.syntaxErrors['main.js'].message)
      .toContain('flipArgs')
  })

  function typeKeys(text) {
    let v = view
    for (let ch of text) v = core.receiveKeydown({key: ch})
    return v
  }
})
