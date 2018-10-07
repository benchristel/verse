import { isNumber, isString } from './nativeTypes'
import { checkArgs } from './types'

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
