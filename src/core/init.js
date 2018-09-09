import {
  startDisplay,
  waitForChar,
  wait,
} from './effects'
import { visualize } from './functionalUtils'
import { isString } from './nativeTypes'

/*
 * These routines run when a Verse app starts.
 */

export default function *init() {
  yield startDisplay(() => {
    if (window.displayText) {
      try {
        let toDisplay = window.displayText()
        if (isString(toDisplay)) return [toDisplay]
        return [visualize(toDisplay)]
      } catch (e) {
        return ['ERROR: ' + e.message]
      }
    } else {
      return []
    }
  })
  if (window.run) {
    if (window.displayText) {
      yield waitForChar()
    }
    yield startDisplay(() => [])
    yield window.run
  } else {
    yield wait(Infinity)
  }
}
