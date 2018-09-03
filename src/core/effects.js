import { isNumber } from './nativeTypes'
import { animationFrame, isAnimationFrame, isKeyDown } from './events'

export function waitForEvent() {
  return {
    effectType: 'waitForEvent'
  }
}

const epsilon = 1e-6

export function *wait(seconds) {
  if (!isNumber(seconds)) {
    throw new Error('wait(...) must be passed the number of seconds to wait, but you passed ' + seconds)
  }
  if (seconds <= 0) return

  let secsLeftToWait = seconds

  let event = yield waitForEvent()
  if (isAnimationFrame(event)) {
    let elapsedSeconds = event.elapsedFrames / 60
    secsLeftToWait -= elapsedSeconds
  }
  if (secsLeftToWait < epsilon) {
    let consumedFrames = seconds * 60
    yield putBackEvent(animationFrame(event.elapsedFrames - consumedFrames))
  } else {
    yield retry(wait(secsLeftToWait))
  }
}

export function putBackEvent(event) {
  return {
    effectType: 'putBackEvent',
    event
  }
}

export function waitForever() {
  return {
    effectType: 'waitForever'
  }
}

export function *waitForChar() {
  let event = yield waitForEvent()
  if (isKeyDown(event)) {
    return event.key
  }
  yield retry(waitForChar())
}

export function waitForInput(prompt='') {
  return function*() {
    let entered = ''
    yield startDisplay(() => {
      return [
        prompt,
        '> ' + entered + '_'
      ]
    })
    yield function* getOneChar() {
      let c = yield waitForChar()
      switch (c) {
        case 'Enter':
        return;

        case 'Backspace':
        entered = entered.slice(0, entered.length - 1)
        break;

        default:
        entered += c
      }
      yield retry(getOneChar)
    }
    // TODO: empty string here is a hack to work around
    // the UI's awkward display implementation.
    yield startDisplay(() => [''])
    return entered
  }
}

export function jump(generator) {
  return {
    effectType: 'jump',
    generator
  }
}

export function retry(generator) {
  return {
    effectType: 'retry',
    generator
  }
}

export function log(message) {
  return {
    effectType: 'log',
    message
  }
}

export function startDisplay(render) {
  return {
    effectType: 'startDisplay',
    render
  }
}

export function startInputDisplay(render) {
  return {
    effectType: 'startInputDisplay',
    render
  }
}

export function perform(action) {
  return {
    effectType: 'perform',
    action
  }
}

export function lineInput() {
  return {
    effectType: 'lineInput',
    definesInputElement: true
  }
}
