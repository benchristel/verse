import { Bard, Store } from './index'

jest.useFakeTimers()

describe('Bard', () => {
  const blankView = {
    error: null,
    logLines: [],
    displayLines: [],
    inputLines: [],
  }

  let store, view, b
  beforeEach(() => {
    store = {
      emit: jest.fn(),
      getState: jest.fn()
    }
    b = Bard(store, v => view = v)
  })

  it('tells a simple tale', () => {
    b.begin(function*(tell) {
      tell('once upon a time')
    })
    expect(store.emit).toBeCalledWith('once upon a time')
  })

  it('pauses for effect', () => {
    b.begin(function*(tell) {
      yield wait(1)
      tell('once upon a time')
    })
    expect(store.emit).not.toBeCalled()
    jest.runTimersToTime(1001)
    expect(store.emit).toBeCalledWith('once upon a time')
  })

  it('pauses repeatedly', () => {
    b.begin(function*(tell) {
      yield wait(1)
      tell('once upon a time')
      yield wait(1)
      tell('there was a dog')
    })
    expect(store.emit).not.toBeCalled()
    jest.runTimersToTime(1001)
    expect(store.emit).toBeCalledWith('once upon a time')
    expect(store.emit).not.toBeCalledWith('there was a dog')
    jest.runTimersToTime(1000)
    expect(store.emit).toBeCalledWith('there was a dog')
  })

  it('interrupts a pause', () => {
    b.begin(function*(tell) {
      let signal = yield wait(1)
      tell('done ' + signal)
    })

    expect(store.emit).not.toBeCalled()
    b.interrupt()
    expect(store.emit).toBeCalledWith('done INTERRUPTED')
  })

  it('interrupts with a custom signal', () => {
    b.begin(function*(tell) {
      let signal = yield wait(1)
      tell('done ' + signal)
    })

    expect(store.emit).not.toBeCalled()
    b.interrupt('boop')
    expect(store.emit).toBeCalledWith('done boop')
  })

  it('cancels the timeout for an interrupted wait', () => {
    b.begin(function*(tell) {
      yield wait(1)
      tell('done')
      yield wait(10)
      tell('should only be called after 10 seconds')
    })

    b.interrupt()
    expect(store.emit).toBeCalledWith('done')
    jest.runTimersToTime(1001)
    expect(store.emit).not.toBeCalledWith('should only be called after 10 seconds')
    jest.runTimersToTime(9000)
    expect(store.emit).toBeCalledWith('should only be called after 10 seconds')
  })

  it('ignores keypresses while pausing', () => {
    b.begin(function*(tell) {
      yield wait(1)
      tell('done')
    })

    b.receiveKeydown({key: 'a'})
    expect(store.emit).not.toBeCalled()
  })

  it('starts a story-within-a-story', () => {
    b.begin(function*(tell) {
      tell('ahem')
      yield function*(tell) {
        tell('a story')
      }
      tell('the end')
    })

    expect(store.emit).toBeCalledWith('ahem')
    expect(store.emit).toBeCalledWith('a story')
    expect(store.emit).toBeCalledWith('the end')
  })

  it('gets the result of a story-within-a-story', () => {
    b.begin(function*(tell) {
      let story = yield function*(tell) {
        return 'cool story bro'
      }
      tell(story)
      tell('the end')
    })

    expect(store.emit).toBeCalledWith('cool story bro')
    expect(store.emit).toBeCalledWith('the end')
  })

  it('waits for divine inspiration from the keyboard', () => {
    b.begin(function*(tell) {
      tell('once there was a dog, and his favorite number was...')
      let number = yield waitForChar()
      tell(number + '!')
    })

    b.receiveKeydown({key: '3'})
    expect(store.emit).toBeCalledWith(
      'once there was a dog, and his favorite number was...')
    expect(store.emit).toBeCalledWith('3!')
  })

  it('interrupts a wait for a keypress', () => {
    b.begin(function*(tell) {
      let c = yield waitForChar()
      tell('' + c)
    })

    b.interrupt()
    expect(store.emit).toBeCalledWith('INTERRUPTED')
  })

  it('receives multiple keypresses', () => {
    b.begin(function*(tell) {
      let result = '', a
      while((a = yield waitForChar()) !== '\n')
        result += a
      tell(result)
    })

    b.receiveKeydown({key: '1'})
    b.receiveKeydown({key: '2'})
    b.receiveKeydown({key: '3'})
    b.receiveKeydown({key: '\n'})
    expect(store.emit).toBeCalledWith('123')
  })

  it('waits for a line of input', () => {
    function waitForInput() {
      return function*(tell) {
        let result = '', a
        while((a = yield waitForChar()) !== 'Enter')
          result += a
        return result
      }
    }

    b.begin(function*(tell) {
      tell('once there was a dog, and his name was...')
      let name = yield waitForInput()
      tell(name + '!')
    })

    b.receiveKeydown({key: 'j'})
    b.receiveKeydown({key: 'i'})
    b.receiveKeydown({key: 'm'})
    b.receiveKeydown({key: 'Enter'})
    expect(store.emit).toBeCalledWith(
      'once there was a dog, and his name was...')
    expect(store.emit).toBeCalledWith('jim!')
  })

  it('starts a background timer thread', () => {
    b.begin(function*(tell) {
      let i = 0
      yield startTimer(1, () => {
        tell('hello ' + i++)
      })
      tell('main thread')
      yield wait(3)
    })

    expect(store.emit).toBeCalledWith('main thread')
    expect(store.emit).not.toBeCalledWith('hello 0')
    jest.runTimersToTime(1001)
    expect(store.emit).toBeCalledWith('hello 0')
    expect(store.emit).not.toBeCalledWith('hello 1')
    jest.runTimersToTime(1000)
    expect(store.emit).toBeCalledWith('hello 1')
  })

  it('stops timers when the stack frame that created them pops', () => {
    b.begin(function*(tell) {
      let a = 0, b = 0
      yield startTimer(0.99, () => tell('a = ' + a++))
      yield startTimer(0.49, () => tell('b = ' + b++))
      tell('main thread')
      yield wait(3)
      tell('done')
    })

    expect(store.emit).toBeCalledWith('main thread')
    expect(store.emit.mock.calls.length).toBe(1)
    jest.runTimersToTime(1000)
    expect(store.emit).toBeCalledWith('a = 0')
    expect(store.emit).toBeCalledWith('b = 0')
    expect(store.emit).toBeCalledWith('b = 1')
    expect(store.emit.mock.calls.length).toBe(4)
    jest.runTimersToTime(1000)
    expect(store.emit).toBeCalledWith('a = 1')
    expect(store.emit).toBeCalledWith('b = 2')
    expect(store.emit).toBeCalledWith('b = 3')
    expect(store.emit.mock.calls.length).toBe(7)
    jest.runTimersToTime(1001)
    expect(store.emit).toBeCalledWith('a = 2')
    expect(store.emit).toBeCalledWith('b = 4')
    expect(store.emit).toBeCalledWith('b = 5')
    expect(store.emit).toBeCalledWith('done')
    expect(store.emit.mock.calls.length).toBe(11)
    jest.runTimersToTime(9999)
    expect(store.emit.mock.calls.length).toBe(11)
  })

  it('jumps to another story', () => {
    b.begin(function*(tell) {
      yield jump(function*(tell) {
        tell('done')
      })
      tell('this never happens')
    })

    expect(store.emit).toBeCalledWith('done')
    expect(store.emit).not.toBeCalledWith('this never happens')
  })

  it('retries the current story', () => {
    let tries = 1
    b.begin(function*(tell) {
      tell('try ' + tries)
      if (tries++ > 2) return
      yield retry()
    })

    expect(store.emit).toBeCalledWith('try 1')
    expect(store.emit).toBeCalledWith('try 2')
    expect(store.emit).toBeCalledWith('try 3')
    expect(store.emit).not.toBeCalledWith('try 4')
  })

  it('aborts if it senses an infinite loop of retries', () => {
    b.begin(function*(tell) {
      yield retry()
    })
    expect(view).toEqual({
      ...blankView,
      error: expect.objectContaining({
        message: 'Too many retry() calls. Is there an infinite loop?'
      })
    })
  })

  it('logs a message', () => {
    b.begin(function*(tell) {
      yield log('hello, world!')
    })

    expect(view).toEqual({
      ...blankView,
      logLines: ['hello, world!']
    })
  })

  it('logs multiple messages', () => {
    b.begin(function*(tell) {
      yield log('hello!')
      yield log('goodbye!')
    })

    expect(view).toEqual({
      ...blankView,
      logLines: ['hello!', 'goodbye!']
    })
  })

  it('plugs the display into a render function', () => {
    b.begin(function*(tell) {
      yield startDisplay(() => {
        return ['whoa']
      })
      yield startInputDisplay(() => {
        return ['1234']
      })
    })
    expect(view).toEqual({
      ...blankView,
      displayLines: ['whoa'],
      inputLines: ['1234']
    })
  })

  it('re-renders when a stack frame pops', () => {
    b.begin(function*(tell) {
      let x = 0
      yield startDisplay(() => {
        return [x]
      })
      x++
    })
    expect(view.displayLines).toEqual([1])
  })

  it('passes the state to the render function', () => {
    store = Store(isString, state => state + 'x')
    b = Bard(store, v => view = v)
    b.begin(function*(tell) {
      yield startDisplay(state => {
        return [state]
      })
      yield startInputDisplay(state => {
        return [state + '1234']
      })
      yield wait(1)
      tell({})
      yield wait(1)
    })

    expect(view.displayLines).toEqual([''])
    expect(view.inputLines).toEqual(['1234'])
    jest.runTimersToTime(1000)
    expect(view.displayLines).toEqual(['x'])
    expect(view.inputLines).toEqual(['x1234'])
  })

  it('reverts the display when the stack frame that rendered it pops', () => {
    b.begin(function*(tell) {
      yield startDisplay(state => {
        return ['outside']
      })
      yield wait(1)
      yield function*() {
        yield startDisplay(state => {
          return ['inside']
        })
        yield wait(1)
      }
      yield wait(1)
    })
    expect(view.displayLines).toEqual(['outside'])
    jest.runTimersToTime(1001)
    // now we're in the inner function*()
    expect(view.displayLines).toEqual(['inside'])
    jest.runTimersToTime(1000)
    // now we're back out
    expect(view.displayLines).toEqual(['outside'])
  })

  it('renders even if more stack frames have been pushed on top of the one that is rendering', () => {
    b.begin(function*(tell) {
      yield startDisplay(() => {
        return ['outside']
      })
      yield startInputDisplay(() => {
        return ['input outside']
      })
      yield function*() {
        yield wait(1)
      }
    })
    expect(view.displayLines).toEqual(['outside'])
    expect(view.inputLines).toEqual(['input outside'])
  })

  it('renders when a timer goes off', () => {
    b.begin(function*(tell) {
      let count = 0
      yield startTimer(1, () => {
        count++
      })
      yield startDisplay(() => [count])
      yield wait(2)
    })
    expect(view.displayLines).toEqual([0])
    jest.runTimersToTime(1001)
    expect(view.displayLines).toEqual([1])
  })

  it('errors if you yield something weird', () => {
    b.begin(function*(tell) {
      yield {boo: 'hoo'}
    })
    expect(view.error.message).toEqual('You `yield`ed something weird: {"boo":"hoo"}')
  })

  it('halts after an error', () => {
    b.begin(function*(tell) {
      yield function*() {
        yield 'bork'
      }
      yield log('never called')
    })
    expect(view.error.message).toBe('You `yield`ed something weird: "bork"')
    expect(view.logLines).toEqual([])
  })

  it('renders an error thrown by the display function', () => {
    b.begin(function*() {
      yield startDisplay(() => {
        throw new Error('yikes')
      })
    })
    expect(view.error.message).toBe('yikes')
  })

  it('renders an error thrown during a redraw', () => {
    let fail = false
    b.begin(function*() {
      yield startDisplay(() => {
        if (fail) throw new Error('yikes')
      })
      yield wait(1)
    })
    fail = true
    b.redraw() // should not throw
    expect(view.error.message).toBe('yikes')
  })

  it('clears the display error on a successful redraw', () => {
    let fail = true
    b.begin(function*() {
      yield startDisplay(() => {
        if (fail) throw new Error('kaboom')
        return ['it works now']
      })
    })

    expect(view.error.message).toBe('kaboom')
    fail = false
    b.redraw()
    expect(view.error).toBeNull()
    expect(view.displayLines).toEqual(['it works now'])
  })

  it('forces a redraw', () => {
    b.begin(function*(tell) {
      let redraws = 0
      yield startDisplay(() => [redraws++])
      yield wait(1)
    })
    expect(view.displayLines).toEqual([1])
    b.redraw()
    expect(view.displayLines).toEqual([2])
  })
})
