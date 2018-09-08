import { Simulator } from './simulate'
import { isNumber } from '../nativeTypes'
import * as utils from '../functionalUtils'
import { startDisplay, wait, waitForChar, perform, retry } from '../effects'
import { keyDown, animationFrame } from '../events'

const {isExactly: is, contains} = utils

describe('simulate', () => {
  let fakeWindow
  let simulate
  beforeEach(() => {
    fakeWindow = {}
    simulate = Simulator(fakeWindow)
  })

  it('asserts that text is displayed', () => {
    function *run() {
      yield startDisplay(() => [
        'hello, world'
      ])
      yield wait(Infinity)
    }

    simulate(run)
      .assertDisplay(contains, 'hello')
  })

  it('fails the test when the displayed text does not match the expectation', () => {
    function *run() {
      yield startDisplay(() => [
        'bork'
      ])
      yield wait(Infinity)
    }

    expect(() => {
      simulate(run)
        .assertDisplay(is, 'hello')
    }).toThrow(new Error('Tried to assert that\n  "bork"\nisExactly\n  "hello"'))
  })

  it('sends an event to the process', () => {
    function *run() {
      let c = 'nothing'
      yield startDisplay(() => [
        'you pressed ' + c
      ])
      c = yield waitForChar()
      yield wait(Infinity)
    }

    simulate(run)
      .assertDisplay(is, 'you pressed nothing')
      .receive(keyDown('a'))
      .assertDisplay(is, 'you pressed a')
  })

  it('maintains state in the Store', () => {
    fakeWindow.getStateType = isNumber
    fakeWindow.reducer = (state, action) => {
      if (action === '+') return state + 1
      if (action === '-') return state - 1
      return state
    }

    function *run() {
      yield startDisplay(state => {
        return [
        'Current value: ' + state
        ]
      })
      let cmd = yield waitForChar()
      yield perform(cmd)
      yield retry(run())
    }

    simulate(run)
      .assertDisplay(is, 'Current value: 0')
      .receive(keyDown('-'))
      .assertDisplay(is, 'Current value: -1')
      .receive(keyDown('+'))
      .receive(keyDown('+'))
      .receive(keyDown('+'))
      .assertDisplay(is, 'Current value: 2')
  })

  it('passes itself to the callback of do()', () => {
    function *run() {
      yield wait(1)
      yield startDisplay(() => ['got here'])
      yield wait(Infinity)
    }

    simulate(run)
      .assertDisplay(is, '')
      .do(waitOneSecond)
      .assertDisplay(is, 'got here')

    function waitOneSecond(simulator) {
      simulator.receive(animationFrame(60))
    }
  })
})
