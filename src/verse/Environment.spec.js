import Environment from './Environment'

describe('Environment', () => {
  let env, output
  beforeEach(() => {
    env = Environment(o => output = o)
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
    env.deploy('main.js', helloWorld)
    env.run()
    expect(output).toEqual({
      logLines: [],
      displayLines: ['hello world'],
      inputLines: [],
      syntaxError: '',
      testFailure: '',
      crash: ''
    })
  })

  it('cleans up', () => {
    env.deploy('main.js', helloWorld)
    expect(window.displayText).toBeDefined()
    env.clean()
    expect(window.displayText).not.toBeDefined()
  })

  it('does not run code if not explicitly requested to run', () => {
    env.deploy('main.js', `
      define({
        displayText() {
          window.sideEffect = true
        }
      })
    `)

    expect(window.sideEffect).not.toBeDefined()
  })

  it('hot-swaps code', () => {
    env.deploy('main.js', helloWorld)
    env.run()
    env.deploy('main.js', helloWorld.replace('hello world', 'changed'))
    expect(output.displayLines).toEqual(['changed'])
  })

  const echo = `
    define({
      *run() {
        let input = yield waitForInput()
        yield log(input)
      }
    })
  `

  xit('runs an interactive app', () => {
    env.deploy('main.js', echo)
    env.run()
    for (let ch of 'abc') env.keydown({key: ch})
    expect(output.inputLines).toEqual([
      '',
      '> abc_'
    ])
    env.keydown({key: 'Enter'})
    expect(output.logLines).toEqual(['abc'])
  })
})
