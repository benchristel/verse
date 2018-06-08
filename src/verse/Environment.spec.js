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
    for (let ch of 'abc') env.keydown({key: ch})
    expect(view.inputLines).toEqual([
      '',
      '> abc_'
    ])
    env.keydown({key: 'Enter'})
    expect(view.logLines).toEqual(['abc'])
    expect(view.inputLines).toEqual([])
  })

  it('hot-swaps interactive code', () => {
    env.deploy('main.js', `
      define({
        munge(input) { return input },

        *run() {
          let input = yield waitForInput()
          yield log(munge(input))
        }
      })
    `)

    env.run()
    env.deploy('main.js', `
      define({
        munge(input) { return reverse(input) },

        *run() {
          let input = yield waitForInput()
          yield log(munge(input))
        }
      })
    `)
    for (let ch of 'abc') env.keydown({key: ch})
    env.keydown({key: 'Enter'})
    expect(view.logLines).toEqual(['cba'])
  })
})
