import { isNumber, isString, isFunction, isGeneratorFunction, isIterator, isAnything } from './nativeTypes'
import { isArrayOf, oneOf } from './types'
import { animationFrame, isAnimationFrame, isKeyDown } from './events'
import { or } from './predicates'
import { checkArgs } from './checkArgs'
import { renameFunction } from './higherOrderFunctions'

export function waitForEvent() {
  return {
    effectType: 'waitForEvent'
  }
}

const epsilon = 1e-6

const wait_interface = {
  example: [0.1],
  types: [isNumber]
}

export function wait(seconds) {
  checkArgs(wait, arguments, wait_interface)
  return waitRoutine(seconds)
}

function *waitRoutine(seconds) {
  if (seconds <= 0) return;
  yield redraw()

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
    yield retry(waitRoutine(secsLeftToWait))
  }
}

export function putBackEvent(event) {
  return {
    effectType: 'putBackEvent',
    event
  }
}

const waitForChar_interface = {example: [], types: []}

export function waitForChar() {
  checkArgs(waitForChar, arguments, waitForChar_interface)
  return function*() {
    yield redraw()
    let event = yield waitForEvent()
    if (isKeyDown(event)) {
      return event.key
    }
    yield retry(waitForChar())
  }
}

// TODO: remove
const waitForInput_interface = {
  example: ['Enter your name'],
  types: [isString],
  optionalArgs: 1
}

// TODO: remove
export function waitForInput(prompt='') {
  checkArgs(waitForInput, arguments, waitForInput_interface)
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

const jump_retry_interface = {
  example: [renameFunction(function*() {}, () => 'run')],
  types: [or(isGeneratorFunction, isIterator)]
}

export function jump(generator) {
  checkArgs(jump, arguments, jump_retry_interface)
  return {
    effectType: 'jump',
    generator
  }
}

export function retry(generator) {
  checkArgs(retry, arguments, jump_retry_interface)
  return {
    effectType: 'retry',
    generator
  }
}

const output_interface = {
  example: ['message'],
  types: [isString]
}

export function output(message) {
  checkArgs(output, arguments, output_interface)
  return function*() {
    yield startDisplay(() => [
      message,
      ' ',
      'Press SPACEBAR to continue.'
    ])
    let key
    while (key !== ' ') key = yield waitForChar()
  }
}

const startDisplay_interface = {
  example: [renameFunction(() => {}, () => 'view')],
  types: [isFunction]
}

export function startDisplay(render) {
  checkArgs(startDisplay, arguments, startDisplay_interface)
  return {
    effectType: 'startDisplay',
    render
  }
}

const perform_interface = {
  example: [{type: 'newGame'}],
  types: [isAnything]
}

export function perform(action) {
  checkArgs(perform, arguments, perform_interface)
  return {
    effectType: 'perform',
    action
  }
}

const showFormFields_interface = {
  example: [[{
    label: 'Search',
    type:  'text',
    value: '',
  }]],
  types: [isArrayOf({
    label: isString,
    type: oneOf('line', 'text'),
    value: isString
  })]
}

export function showFormFields(fields) {
  checkArgs(showFormFields, arguments, showFormFields_interface)
  return {
    effectType: 'showFormFields',
    fields
  }
}

const redraw_interface = {
  example: [], types: []
}

export function redraw() {
  checkArgs(redraw, arguments, redraw_interface)
  return {
    effectType: 'redraw'
  }
}
