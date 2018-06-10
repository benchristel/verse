import Environment from './Environment'

describe('Environment', () => {
  let env, view
  beforeEach(() => {
    env = Environment(v => view = v)
  })

  afterEach(() => {
    env.clean()
  })

  const helloWorld = `
    define({
      displayText() {
        return 'hello world'
      }
    })
  `

  it('can define a "hello world" program', () => {
    env.run()
    env.deploy('main.js', helloWorld)
    expect(view.displayLines).toEqual(['hello world'])
  })

  it('outputs all the display components', () => {
    env.run()
    env.deploy('main.js', helloWorld)
    expect(view).toEqual({
      logLines: [],
      displayLines: ['hello world'],
      inputLines: [],
      error: null,
      syntaxErrors: {},
    })
  })

  it('cleans up', () => {
    env.run()
    env.deploy('main.js', helloWorld)
    expect(window.displayText).toBeDefined()
    env.clean()
    expect(window.displayText).not.toBeDefined()
  })

  it('does not run code if not explicitly requested to run', () => {
    env.deploy('main.js', 'window.sideEffect = true')
    expect(window.sideEffect).not.toBeDefined()
  })

  it('DOES run code if requested after the code is deployed', () => {
    env.deploy('main.js', helloWorld)
    env.run()
    expect(view.displayLines).toEqual(['hello world'])
  })

  it('reports an error if one of the modules fails to eval', () => {
    env.deploy('main.js', helloWorld + '}') // syntax error!
    env.run()
    expect(view.syntaxErrors['main.js'].toString()).toContain('SyntaxError')
  })

  it('hot-swaps code', () => {
    env.run()
    env.deploy('main.js', helloWorld)
    env.deploy('main.js', helloWorld.replace('hello world', 'changed'))
    expect(view.displayLines).toEqual(['changed'])
  })

  it('does not reinstate the old version of a function after hot-swap and restart', () => {
    env.deploy('main.js', helloWorld)
    env.run()
    env.deploy('main.js', helloWorld.replace('hello world', 'changed'))
    env.run()
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
    env.deploy('main.js', echo)
    env.run()
    expect(view.inputLines).toEqual([
      '',
      '> _'
    ])
    typeKeys('abc')
    expect(view.inputLines).toEqual([
      '',
      '> abc_'
    ])
    env.receiveKeydown({key: 'Enter'})
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

    env.deploy('main.js', munge)
    env.run()
    env.deploy('main.js', munge.replace('return input', 'return reverse(input)'))
    typeKeys('abc')
    env.receiveKeydown({key: 'Enter'})
    expect(view.logLines).toEqual(['cba'])
  })

  it('runs an app that uses the store', () => {
    env.deploy('main.js', `
      define({
        getStateType() {
          return isNumber
        },

        reducer(state) {
          return state + 1
        },

        *run(update) {
          yield startDisplay(state => [state])
          update({})
          update({})
          update({})
          yield wait(1)
        }
      })
    `)
    env.run()
    expect(view.displayLines).toEqual([3])
  })

  function typeKeys(text) {
    for (let ch of text) env.receiveKeydown({key: ch})
  }
})
