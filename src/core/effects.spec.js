import { waitForInput } from './effects'
import { Process } from './Process'

describe('waitForInput', () => {
  let store, view, p
  beforeEach(() => {
    store = {
      emit: jest.fn(),
      getState: jest.fn()
    }
    p = Process(store, v => view = v)
  })

  afterEach(() => {
    expect(view.error).toBeNull()
  })

  it('prints the prompt', () => {
    p.begin(function *() {
      yield waitForInput('Your message here')
    })

    expect(view).toEqual(expect.objectContaining({
      inputLines: [
        'Your message here',
        '> _'
      ]
    }))
  })

  it('defaults the prompt to blank', () => {
    p.begin(function *() {
      yield waitForInput()
    })

    expect(view.inputLines).toEqual([
      '',
      '> _'
    ])
  })

  it('lets you enter a blank line', () => {
    let line
    p.begin(function *() {
      line = yield waitForInput()
    })
    p.receiveKeydown({key: 'Enter'})
    expect(line).toBe('')
  })

  it('returns entered text', () => {
    let line
    p.begin(function *() {
      line = yield waitForInput()
    })
    p.receiveKeydown({key: 'h'})
    p.receiveKeydown({key: 'i'})
    p.receiveKeydown({key: 'Enter'})
    expect(line).toBe('hi')
  })

  it('echoes text as you type', () => {
    p.begin(function *() {
      yield waitForInput()
    })
    p.receiveKeydown({key: 'h'})
    expect(view.inputLines).toEqual([
      '',
      '> h_'
    ])
    p.receiveKeydown({key: 'i'})
    expect(view.inputLines).toEqual([
      '',
      '> hi_'
    ])
  })

  it('backspaces', () => {
    p.begin(function *() {
      yield waitForInput()
    })
    p.receiveKeydown({key: 'h'})
    expect(view.inputLines).toEqual([
      '',
      '> h_'
    ])
    p.receiveKeydown({key: 'Backspace'})
    expect(view.inputLines).toEqual([
      '',
      '> _'
    ])
  })

  it('does nothing if you backspace when there is no input', () => {
    p.begin(function *() {
      yield waitForInput()
    })
    p.receiveKeydown({key: 'Backspace'})
    expect(view.inputLines).toEqual([
      '',
      '> _'
    ])
  })

  it('clears the input display when it\'s done', () => {
    p.begin(function *() {
      yield waitForInput()
    })
    p.receiveKeydown({key: 'Enter'})
    expect(view.inputLines).toEqual([])
  })
})