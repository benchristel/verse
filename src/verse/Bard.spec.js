import { Bard, Store, perform } from './index'
import '../api'

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
    b.begin(function*() {
      yield perform('once upon a time')
    })
    expect(view.error).toBeNull()
    expect(store.emit).toBeCalledWith('once upon a time')
  })

  it('pauses for effect', () => {
    b.begin(function*() {
      yield wait(1)
      yield perform('once upon a time')
    })
    expect(store.emit).not.toBeCalled()
    jest.runTimersToTime(1001)
    expect(store.emit).toBeCalledWith('once upon a time')
  })

  it('pauses repeatedly', () => {
    b.begin(function*() {
      yield wait(1)
      yield perform('once upon a time')
      yield wait(1)
      yield perform('there was a dog')
    })
    expect(store.emit).not.toBeCalled()
    jest.runTimersToTime(1001)
    expect(store.emit).toBeCalledWith('once upon a time')
    expect(store.emit).not.toBeCalledWith('there was a dog')
    jest.runTimersToTime(1000)
    expect(store.emit).toBeCalledWith('there was a dog')
  })

  it('interrupts a pause', () => {
    b.begin(function*() {
      let signal = yield wait(1)
      yield perform('done ' + signal)
    })

    expect(store.emit).not.toBeCalled()
    b.interrupt()
    expect(store.emit).toBeCalledWith('done INTERRUPTED')
  })

  it('waits forever', () => {
    b.begin(function*() {
      yield waitForever()
      yield perform('should never happen')
    })

    expect(view.error).toBeNull()
    jest.runTimersToTime(2 << 32)
    expect(store.emit).not.toBeCalled()
  })

  it('cancels the wait when it is stopped', () => {
    b.begin(function*() {
      yield wait(1)
      yield perform('should never happen')
    })
    jest.runTimersToTime(500)
    b.stop()
    jest.runTimersToTime(1000)
    expect(store.emit).not.toBeCalled()
  })

  it('interrupts with a custom signal', () => {
    b.begin(function*() {
      let signal = yield wait(1)
      yield perform('done ' + signal)
    })

    expect(store.emit).not.toBeCalled()
    b.interrupt('boop')
    expect(store.emit).toBeCalledWith('done boop')
  })

  it('cancels the timeout for an interrupted wait', () => {
    b.begin(function*() {
      yield wait(1)
      yield perform('done')
      yield wait(10)
      yield perform('should only be called after 10 seconds')
    })

    b.interrupt()
    expect(store.emit).toBeCalledWith('done')
    jest.runTimersToTime(1001)
    expect(store.emit).not.toBeCalledWith('should only be called after 10 seconds')
    jest.runTimersToTime(9000)
    expect(store.emit).toBeCalledWith('should only be called after 10 seconds')
  })

  it('ignores keypresses while pausing', () => {
    b.begin(function*() {
      yield wait(1)
      yield perform('done')
    })

    b.receiveKeydown({key: 'a'})
    expect(store.emit).not.toBeCalled()
  })

  it('starts a story-within-a-story', () => {
    function* story(subject) {
      yield perform('a story about ' + subject)
    }
    b.begin(function*() {
      yield perform('ahem')
      yield story('dogs')
      yield perform('the end')
    })

    expect(store.emit).toBeCalledWith('ahem')
    expect(store.emit).toBeCalledWith('a story about dogs')
    expect(store.emit).toBeCalledWith('the end')
  })

  it('gets the result of a story-within-a-story', () => {
    b.begin(function*() {
      let story = yield function*() {
        return 'cool story bro'
      }
      yield perform(story)
      yield perform('the end')
    })

    expect(store.emit).toBeCalledWith('cool story bro')
    expect(store.emit).toBeCalledWith('the end')
  })

  it('waits for divine inspiration from the keyboard', () => {
    b.begin(function*() {
      yield perform('once there was a dog, and his favorite number was...')
      let number = yield waitForChar()
      yield perform(number + '!')
    })

    b.receiveKeydown({key: '3'})
    expect(store.emit).toBeCalledWith(
      'once there was a dog, and his favorite number was...')
    expect(store.emit).toBeCalledWith('3!')
  })

  it('interrupts a wait for a keypress', () => {
    b.begin(function*() {
      let c = yield waitForChar()
      yield perform('' + c)
    })

    b.interrupt()
    expect(store.emit).toBeCalledWith('INTERRUPTED')
  })

  it('receives multiple keypresses', () => {
    b.begin(function*() {
      let result = '', a
      while((a = yield waitForChar()) !== '\n')
        result += a
      yield perform(result)
    })

    b.receiveKeydown({key: '1'})
    b.receiveKeydown({key: '2'})
    b.receiveKeydown({key: '3'})
    b.receiveKeydown({key: '\n'})
    expect(store.emit).toBeCalledWith('123')
  })

  it('waits for a line of input', () => {
    function waitForInput() {
      return function*() {
        let result = '', a
        while((a = yield waitForChar()) !== 'Enter')
          result += a
        return result
      }
    }

    b.begin(function*() {
      yield perform('once there was a dog, and his name was...')
      let name = yield waitForInput()
      yield perform(name + '!')
    })

    b.receiveKeydown({key: 'j'})
    b.receiveKeydown({key: 'i'})
    b.receiveKeydown({key: 'm'})
    b.receiveKeydown({key: 'Enter'})
    expect(store.emit).toBeCalledWith(
      'once there was a dog, and his name was...')
    expect(store.emit).toBeCalledWith('jim!')
  })

  it('jumps to another story', () => {
    b.begin(function*() {
      yield jump(function*() {
        yield perform('done')
      })
      yield perform('this never happens')
    })

    expect(store.emit).toBeCalledWith('done')
    expect(store.emit).not.toBeCalledWith('this never happens')
  })

  it('retries the current story', () => {
    let tries = 1
    b.begin(function* main() {
      yield perform('try ' + tries)
      if (tries++ > 2) return
      yield main
    })

    expect(store.emit).toBeCalledWith('try 1')
    expect(store.emit).toBeCalledWith('try 2')
    expect(store.emit).toBeCalledWith('try 3')
    expect(store.emit).not.toBeCalledWith('try 4')
  })

  it('performs an action by yielding it', () => {
    b.begin(function*() {
      yield perform('the action')
    })
    expect(store.emit).toBeCalledWith('the action')
  })

  it('loops', () => {
    let iterations = 0
    b.begin(function*() {
      yield function* retryable() {
        yield perform(iterations++)
        if (iterations < 3) yield retryable()
      }
    })

    expect(store.emit).toBeCalledWith(0)
    expect(store.emit).toBeCalledWith(1)
    expect(store.emit).toBeCalledWith(2)
  })

  it('aborts if it senses an infinite loop of retries', () => {
    b.begin(function* main() {
      yield retry(main)
    })
    expect(view).toEqual({
      ...blankView,
      error: expect.objectContaining({
        message: 'Infinite retry loop detected'
      })
    })
  })

  it('aborts if it senses infinite recursion', () => {
    b.begin(function* main() {
      yield main
    })
    expect(view).toEqual({
      ...blankView,
      error: expect.objectContaining({
        message: 'Infinite retry loop detected'
      })
    })
  })

  it('logs a message', () => {
    b.begin(function*() {
      yield log('hello, world!')
    })

    expect(view).toEqual({
      ...blankView,
      logLines: ['hello, world!']
    })
  })

  it('logs multiple messages', () => {
    b.begin(function*() {
      yield log('hello!')
      yield log('goodbye!')
    })

    expect(view).toEqual({
      ...blankView,
      logLines: ['hello!', 'goodbye!']
    })
  })

  it('plugs the display into a render function', () => {
    b.begin(function*() {
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
    b.begin(function*() {
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
    b.begin(function*() {
      yield startDisplay(state => {
        return [state]
      })
      yield startInputDisplay(state => {
        return [state + '1234']
      })
      yield wait(1)
      yield perform({})
      yield wait(1)
    })

    expect(view.displayLines).toEqual([''])
    expect(view.inputLines).toEqual(['1234'])
    jest.runTimersToTime(1000)
    expect(view.displayLines).toEqual(['x'])
    expect(view.inputLines).toEqual(['x1234'])
  })

  it('reverts the display when the stack frame that rendered it pops', () => {
    b.begin(function*() {
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
    b.begin(function*() {
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

  it('errors if you yield something weird', () => {
    b.begin(function*() {
      yield {boo: 'hoo'}
    })
    expect(view.error.message).toEqual('You `yield`ed something weird: {"boo":"hoo"}')
  })

  it('halts after an error', () => {
    b.begin(function*() {
      yield function*() {
        yield 'bork'
      }
      yield log('never called')
    })
    expect(view.error.message).toBe('You `yield`ed something weird: "bork"')
    expect(view.logLines).toEqual([])
    b.redraw() // should do nothing
    expect(view.error.message).toBe('You `yield`ed something weird: "bork"')
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

  it('forces a redraw', () => {
    b.begin(function*() {
      let redraws = 0
      yield startDisplay(() => [redraws++])
      yield wait(1)
    })
    expect(view.displayLines).toEqual([1])
    b.redraw()
    expect(view.displayLines).toEqual([2])
  })
})
