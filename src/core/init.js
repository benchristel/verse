import {
  startDisplay,
  waitForChar,
  wait,
} from './effects'

/*
 * These routines run when a Verse app starts.
 */

export default function *init() {
  yield startDisplay(() => {
    if (window.displayText) {
      try {
        return ['' + window.displayText()]
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
