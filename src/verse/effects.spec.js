import { Bard, waitForInput } from './index'

describe('waitForInput', () => {
  let store, view, b
  beforeEach(() => {
    store = {
      emit: jest.fn(),
      getState: jest.fn()
    }
    view = {
      log: jest.fn(),
      screen: jest.fn(),
      input: jest.fn(),
      error: jest.fn()
    }
    b = Bard(store, view)
  })

  afterEach(() => {
    expect(view.error).not.toHaveBeenCalled()
  })

  it('prints the prompt', () => {
    b.begin(function *() {
      yield waitForInput('Your message here')
    })

    expect(view.input).toHaveBeenCalledWith([
      'Your message here',
      '> _'
    ])
  })

  it('defaults the prompt to blank', () => {
    b.begin(function *() {
      yield waitForInput()
    })

    expect(view.input).toHaveBeenCalledWith([
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
    expect(view.input).toHaveBeenCalledWith([
      '',
      '> h_'
    ])
    b.receiveKeydown({key: 'i'})
    expect(view.input).toHaveBeenCalledWith([
      '',
      '> hi_'
    ])
  })

  it('backspaces', () => {
    b.begin(function *() {
      yield waitForInput()
    })
    b.receiveKeydown({key: 'h'})
    expect(view.input).toHaveBeenCalledWith([
      '',
      '> h_'
    ])
    b.receiveKeydown({key: 'Backspace'})
    expect(lastOf(view.input.mock.calls)[0]).toEqual([
      '',
      '> _'
    ])
  })

  it('does nothing if you backspace when there is no input', () => {
    b.begin(function *() {
      yield waitForInput()
    })
    b.receiveKeydown({key: 'Backspace'})
    expect(lastOf(view.input.mock.calls)[0]).toEqual([
      '',
      '> _'
    ])
  })

  it('clears the input display when it\'s done', () => {
    b.begin(function *() {
      yield waitForInput()
    })
    b.receiveKeydown({key: 'Enter'})
    expect(lastOf(view.input.mock.calls)[0])
      .toEqual([''])
  })
})
