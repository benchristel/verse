import { isNumber, isString } from './nativeTypes'
import { checkArgs } from './checkArgs'

const animationFrame_interface = {
  example: [60],
  types: [isNumber]
}

export function animationFrame(elapsedFrames) {
  checkArgs(animationFrame, arguments, animationFrame_interface)
  return {
    eventType: 'animationFrame',
    elapsedFrames
  }
}

export function isAnimationFrame(event) {
  return event.eventType === 'animationFrame'
}

const keyDown_interface = {
  example: ['a'],
  types: [isString]
}

export function keyDown(key) {
  checkArgs(keyDown, arguments, keyDown_interface)
  return {
    eventType: 'keyDown',
    key
  }
}

export function isKeyDown(event) {
  return event.eventType === 'keyDown'
}

const formSubmission_interface = {
  example: [], types: []
}

export function formSubmission() {
  checkArgs(formSubmission, arguments, formSubmission_interface)
  return {
    eventType: 'formSubmission'
  }
}

export function isFormSubmission(event) {
  return event.eventType === 'formSubmission'
}

const formFieldChange_interface = {
  example: ['Search', 'wolf riders'],
  types: [isString, isString]
}

export function formFieldChange(label, value) {
  checkArgs(formFieldChange, arguments, formFieldChange_interface)
  return {
    eventType: 'formFieldChange',
    label,
    value
  }
}

export function isFormFieldChange(event) {
  return event.eventType === 'formFieldChange'
}
