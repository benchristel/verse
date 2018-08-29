import { wait, waitForInput } from './effects'
import { keyDown } from './events'
import { Process } from './Process'

describe('waitForInput', () => {
  let store, view, p
  beforeEach(() => {
    store = {
      emit: jest.fn(),
      getState: jest.fn()
    }
    p = Process(store)
  })

  afterEach(() => {
    expect(view.error).toBeNull()
  })

  it('prints the prompt', () => {
    view = p.begin(function *() {
      yield waitForInput('Your message here')
    })

    expect(view).toEqual(expect.objectContaining({
      displayLines: [
        'Your message here',
        '> _'
      ]
    }))
  })

  it('defaults the prompt to blank', () => {
    let view = p.begin(function *() {
      yield waitForInput()
    })

    expect(view.displayLines).toEqual([
      '',
      '> _'
    ])
  })

  it('lets you enter a blank line', () => {
    let line
    p.begin(function *() {
      line = yield waitForInput()
    })
    p.receive(keyDown('Enter'))
    expect(line).toBe('')
  })

  it('returns entered text', () => {
    let line
    p.begin(function *() {
      line = yield waitForInput()
    })
    p.receive(keyDown('h'))
    p.receive(keyDown('i'))
    p.receive(keyDown('Enter'))
    expect(line).toBe('hi')
  })

  it('echoes text as you type', () => {
    p.begin(function *() {
      yield waitForInput()
    })
    view = p.receive(keyDown('h'))
    expect(view.displayLines).toEqual([
      '',
      '> h_'
    ])
    view = p.receive(keyDown('i'))
    expect(view.displayLines).toEqual([
      '',
      '> hi_'
    ])
  })

  it('backspaces', () => {
    p.begin(function *() {
      yield waitForInput()
    })
    view = p.receive(keyDown('h'))
    expect(view.displayLines).toEqual([
      '',
      '> h_'
    ])
    view = p.receive(keyDown('Backspace'))
    expect(view.displayLines).toEqual([
      '',
      '> _'
    ])
  })

  it('does nothing if you backspace when there is no input', () => {
    p.begin(function *() {
      yield waitForInput()
    })
    view = p.receive(keyDown('Backspace'))
    expect(view.displayLines).toEqual([
      '',
      '> _'
    ])
  })

  it('clears the input display when it\'s done', () => {
    p.begin(function *() {
      yield waitForInput()
    })
    view = p.receive(keyDown('Enter'))
    expect(view.displayLines).toEqual([])
  })
})

describe('wait', () => {
  it('throws an error if you pass undefined', () => {
    expect(() => wait().next()).toThrow(new Error('wait(...) must be passed the number of seconds to wait, but you passed undefined'))
  })

  it('throws an error if you pass a string', () => {
    expect(() => wait('hi').next()).toThrow(new Error('wait(...) must be passed the number of seconds to wait, but you passed hi'))
  })
})
