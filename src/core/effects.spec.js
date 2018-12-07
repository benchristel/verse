import { wait, waitForInput, perform } from './effects'
import { keyDown, animationFrame } from './events'
import { Process } from './Process'

describe('effects', () => {
  let store, view, p
  beforeEach(() => {
    view = null
    store = {
      emit: jest.fn(),
      getState: jest.fn()
    }
    p = Process(store)
  })

  afterEach(() => {
    expect(view.error).toBeNull()
  })

  // =======================================================
  // wait tests
  // =======================================================

  describe('wait', () => {
    it('pauses for a specified time', () => {
      let finishedWait = false
      p.begin(function*() {
        yield wait(1)
        finishedWait = true
      })
      p.receive(animationFrame(59))
      expect(finishedWait).toBe(false)
      view = p.receive(animationFrame(1))
      expect(finishedWait).toBe(true)
    })

    it('executes multiple waits in a single turn if many frames have passed', () => {
      p.begin(function*() {
        yield wait(0.1)
        yield wait(0.1)
        yield wait(0.1)
        yield perform('once upon a time')
        yield wait(1)
        yield perform('not called')
      })
      view = p.receive(animationFrame(60))
      expect(store.emit).toBeCalledWith('once upon a time')
      expect(store.emit).not.toBeCalledWith('not called')
    })

    it('does nothing given a zero or negative amount of time', () => {
      view = p.begin(function*() {
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
      view = p.receive(animationFrame(60))
      expect(store.emit).toBeCalledWith('there was a dog')
    })

    it('waits forever', () => {
      view = p.begin(function*() {
        yield wait(Infinity)
        yield perform('should never happen')
      })

      expect(view.error).toBeNull()
      view = p.receive(animationFrame(0xffffffff))
      expect(store.emit).not.toBeCalled()
    })

    it('ignores keypresses while pausing', () => {
      p.begin(function*() {
        yield wait(1)
        yield perform('done')
      })

      view = p.receive(keyDown('a'))
      expect(store.emit).not.toBeCalled()
    })
  })
})
