import mozStackParser from './mozStackParser'
import webkitStackParser from './webkitStackParser'

export default function stackParser(stack) {
  if (window.stackStyle === 'moz') {
    return mozStackParser(stack)
  } else {
    return webkitStackParser(stack)
  }
}
