import { Store, perform } from './index'
import { Process } from './Process'
import { animationFrame, keyDown } from './events'
import { wait, showFormFields } from './effects'
import './api'

describe('Process', () => {
  const blankView = {
    error: null,
    displayLines: [],
    form: {},
    formId: expect.any(Number),
  }

  let store, p
  beforeEach(() => {
    store = {
      emit: jest.fn(),
      getState: jest.fn()
    }
    p = Process(store, v => v) // TODO delete callback
  })

  it('runs a simple routine', () => {
    let view = p.begin(function*() {
      yield perform('once upon a time')
    })
    expect(view.error).toBeNull()
    expect(store.emit).toBeCalledWith('once upon a time')
  })

  it('waits for an event from the outside world', () => {
    let view = p.begin(function*() {
      let event = yield waitForEvent()
      yield perform('got ' + event)
    })
    expect(store.emit).not.toBeCalled()
    expect(view.error).toBeNull()
    p.receive('plot twist')
    expect(store.emit).toBeCalledWith('got plot twist')
  })

  it('pauses for a specified time', () => {
    p.begin(function*() {
      yield wait(1)
      yield perform('once upon a time')
    })
    p.receive(animationFrame(59))
    expect(store.emit).not.toBeCalled()
    p.receive(animationFrame(1))
    expect(store.emit).toBeCalledWith('once upon a time')
  })

  it('execute multiple waits in a single turn if many frames have passed', () => {
    p.begin(function*() {
      yield wait(0.1)
      yield wait(0.1)
      yield wait(0.1)
      yield perform('once upon a time')
      yield wait(1)
      yield perform('not called')
    })
    p.receive(animationFrame(60))
    expect(store.emit).toBeCalledWith('once upon a time')
    expect(store.emit).not.toBeCalledWith('not called')
  })

  it('ignores waits for zero or negative amounts of time', () => {
    p.begin(function*() {
      yield wait(0)
      yield wait(-1)
      yield perform('once upon a time')
    })
    expect(store.emit).toBeCalledWith('once upon a time')
  })

  it('pauses repeatedly', () => {
    p.begin(function*() {
      yield wait(1)
      yield perform('once upon a time')
      yield wait(1)
      yield perform('there was a dog')
    })
    expect(store.emit).not.toBeCalled()
    p.receive(animationFrame(60))
    expect(store.emit).toBeCalledWith('once upon a time')
    expect(store.emit).not.toBeCalledWith('there was a dog')
    p.receive(animationFrame(60))
    expect(store.emit).toBeCalledWith('there was a dog')
  })

  it('waits forever', () => {
    let view = p.begin(function*() {
      yield wait(Infinity)
      yield perform('should never happen')
    })

    expect(view.error).toBeNull()
    p.receive(animationFrame(0xffffffff))
    expect(store.emit).not.toBeCalled()
  })

  it('ignores keypresses while pausing', () => {
    p.begin(function*() {
      yield wait(1)
      yield perform('done')
    })

    p.receive(keyDown('a'))
    expect(store.emit).not.toBeCalled()
  })

  it('returns the current state from `yield perform`', () => {
    store.getState.mockReturnValue('the state')
    let state
    p.begin(function*() {
      state = yield perform('foo')
    })
    expect(state).toBe('the state')
  })

  it('runs a subroutine', () => {
    function* story(subject) {
      yield perform('a story about ' + subject)
    }
    p.begin(function*() {
      yield perform('ahem')
      yield story('dogs')
      yield perform('the end')
    })

    expect(store.emit).toBeCalledWith('ahem')
    expect(store.emit).toBeCalledWith('a story about dogs')
    expect(store.emit).toBeCalledWith('the end')
  })

  it('gets the result of a subroutine', () => {
    p.begin(function*() {
      let story = yield function*() {
        return 'cool story bro'
      }
      yield perform(story)
      yield perform('the end')
    })

    expect(store.emit).toBeCalledWith('cool story bro')
    expect(store.emit).toBeCalledWith('the end')
  })

  it('waits for keyboard input', () => {
    p.begin(function*() {
      yield perform('once there was a dog, and his favorite number was...')
      let number = yield waitForChar()
      yield perform(number + '!')
    })

    p.receive(keyDown('3'))
    expect(store.emit).toBeCalledWith(
      'once there was a dog, and his favorite number was...')
    expect(store.emit).toBeCalledWith('3!')
  })

  it('receives multiple keypresses', () => {
    p.begin(function*() {
      let result = '', a
      while((a = yield waitForChar()) !== 'Enter')
        result += a
      yield perform(result)
    })

    p.receive(keyDown('1'))
    p.receive(keyDown('2'))
    p.receive(keyDown('3'))
    p.receive(keyDown('Enter'))
    expect(store.emit).toBeCalledWith('123')
  })

  it('shows a form on the screen', () => {
    let view = p.begin(function*() {
      yield showFormFields([
        {
          label: 'Name',
          type:  'line',
          value: ''
        }
      ])
      yield waitForEvent()
    })

    expect(view.error).toBeNull()
    expect(view.form).toEqual([
      {
        label: 'Name',
        type:  'line',
        value: ''
      }
    ])
  })

  it('jumps to another routine', () => {
    p.begin(function*() {
      yield jump(function*() {
        yield perform('done')
      })
      yield perform('this never happens')
    })

    expect(store.emit).toBeCalledWith('done')
    expect(store.emit).not.toBeCalledWith('this never happens')
  })

  it('retries the current routine', () => {
    let tries = 1
    p.begin(function* main() {
      yield perform('try ' + tries)
      if (tries++ > 2) return
      yield retry(main())
    })

    expect(store.emit).toBeCalledWith('try 1')
    expect(store.emit).toBeCalledWith('try 2')
    expect(store.emit).toBeCalledWith('try 3')
    expect(store.emit).not.toBeCalledWith('try 4')
  })

  it('performs an action by yielding it', () => {
    p.begin(function*() {
      yield perform('the action')
    })
    expect(store.emit).toBeCalledWith('the action')
  })

  it('loops', () => {
    let iterations = 0
    let view = p.begin(function*() {
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
    let view = p.begin(function* main() {
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
    let view = p.begin(function* main() {
      yield main
    })
    expect(view).toEqual({
      ...blankView,
      error: expect.objectContaining({
        message: 'Infinite retry loop detected'
      })
    })
  })

  it('outputs a message', () => {
    let view = p.begin(function*() {
      yield output('hello, world!')
    })

    expect(view).toEqual({
      ...blankView,
      displayLines: ['hello, world!', ' ', 'Press SPACEBAR to continue.']
    })
  })

  it('plugs the display into a render function', () => {
    let view = p.begin(function*() {
      yield startDisplay(() => {
        return ['whoa']
      })
    })
    expect(view).toEqual({
      ...blankView,
      displayLines: ['whoa']
    })
  })

  it('re-renders when a stack frame pops', () => {
    let view = p.begin(function*() {
      let x = 0
      yield startDisplay(() => {
        return [x]
      })
      x++
    })
    expect(view.displayLines).toEqual(['1'])
  })

  it('passes the state to the render function', () => {
    store = Store(isString, state => state + 'x')
    p = Process(store)
    let view = p.begin(function*() {
      yield startDisplay(state => {
        return [state]
      })
      yield wait(1)
      yield perform({})
      yield wait(1)
    })

    expect(view.displayLines).toEqual([''])
    view = p.receive(animationFrame(60))
    expect(view.displayLines).toEqual(['x'])
  })

  it('reverts the display when the stack frame that rendered it pops', () => {
    let view = p.begin(function*() {
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
    view = p.receive(animationFrame(60))
    // now we're in the inner function*()
    expect(view.displayLines).toEqual(['inside'])
    view = p.receive(animationFrame(60))
    // now we're back out
    expect(view.displayLines).toEqual(['outside'])
  })

  it('renders even if more stack frames have been pushed on top of the one that is rendering', () => {
    let view = p.begin(function*() {
      yield startDisplay(() => {
        return ['outside']
      })
      yield function*() {
        yield wait(Infinity)
      }
    })
    expect(view.displayLines).toEqual(['outside'])
  })

  it('errors if you yield something weird', () => {
    let view = p.begin(function*() {
      yield {boo: 'hoo'}
    })
    expect(view.error.message).toEqual('You `yield`ed something weird: {"boo":"hoo"}')
  })

  it('halts after an error', () => {
    let view = p.begin(function*() {
      yield function*() {
        yield 'bork'
      }
      yield output('never called')
    })
    expect(view.error.message).toBe('You `yield`ed something weird: "bork"')
    expect(view.displayLines).toEqual([])
    view = p.redraw() // should do nothing
    expect(view.error.message).toBe('You `yield`ed something weird: "bork"')
  })

  it('renders an error thrown by the display function', () => {
    let view = p.begin(function*() {
      yield startDisplay(() => {
        throw new Error('yikes')
      })
    })
    expect(view.error.message).toBe('yikes')
  })

  it('renders an error thrown during a redraw', () => {
    let fail = false
    let view = p.begin(function*() {
      yield startDisplay(() => {
        if (fail) throw new Error('yikes')
      })
      yield wait(1)
    })
    fail = true
    view = p.redraw() // should not throw
    expect(view.error.message).toBe('yikes')
  })

  it('forces a redraw', () => {
    let view = p.begin(function*() {
      let redraws = 0
      yield startDisplay(() => [redraws++])
      yield wait(1)
    })
    expect(view.displayLines).toEqual(['0'])
    view = p.redraw()
    expect(view.displayLines).toEqual(['1'])
  })
})
