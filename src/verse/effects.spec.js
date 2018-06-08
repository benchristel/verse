import { Bard, waitForInput } from './index'

describe('waitForInput', () => {
  let store, view, b
  beforeEach(() => {
    store = {
      emit: jest.fn(),
      getState: jest.fn()
    }
    b = Bard(store, v => view = v)
  })

  afterEach(() => {
    expect(view.error).toBeNull()
  })

  it('prints the prompt', () => {
    b.begin(function *() {
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
    b.begin(function *() {
      yield waitForInput()
    })

    expect(view.inputLines).toEqual([
      '',
      '> _'
    ])
  })

  it('lets you enter a blank line', () => {
    let line
    b.begin(function *() {
      line = yield waitForInput()
    })
    b.receiveKeydown({key: 'Enter'})
    expect(line).toBe('')
  })

  it('returns entered text', () => {
    let line
    b.begin(function *() {
      line = yield waitForInput()
    })
    b.receiveKeydown({key: 'h'})
    b.receiveKeydown({key: 'i'})
    b.receiveKeydown({key: 'Enter'})
    expect(line).toBe('hi')
  })

  it('echoes text as you type', () => {
    b.begin(function *() {
      yield waitForInput()
    })
    b.receiveKeydown({key: 'h'})
    expect(view.inputLines).toEqual([
      '',
      '> h_'
    ])
    b.receiveKeydown({key: 'i'})
    expect(view.inputLines).toEqual([
      '',
      '> hi_'
    ])
  })

  it('backspaces', () => {
    b.begin(function *() {
      yield waitForInput()
    })
    b.receiveKeydown({key: 'h'})
    expect(view.inputLines).toEqual([
      '',
      '> h_'
    ])
    b.receiveKeydown({key: 'Backspace'})
    expect(view.inputLines).toEqual([
      '',
      '> _'
    ])
  })

  it('does nothing if you backspace when there is no input', () => {
    b.begin(function *() {
      yield waitForInput()
    })
    b.receiveKeydown({key: 'Backspace'})
    expect(view.inputLines).toEqual([
      '',
      '> _'
    ])
  })

  it('clears the input display when it\'s done', () => {
    b.begin(function *() {
      yield waitForInput()
    })
    b.receiveKeydown({key: 'Enter'})
    expect(view.inputLines).toEqual([])
  })
})
