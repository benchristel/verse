import Definer from './Definer'
import thunk from './thunk'
import {
  App,
  NullBard,
  startDisplay,
  startInputDisplay,
  wait,
  retry,
  waitForChar
} from './verse'
import tryThings from './tryThings'
import debounce from 'debounce'

let app = NullBard()
let definer = Definer(window)

export default {
  runApp(actions) {
    app.stop()
    let appHooks = {
      init:         window.init,
      getStateType: window.getStateType,
      reducer:      window.reducer,
      view:         View(actions)
    }
    app = App(appHooks)
  },

  evaluateScript: debounce(function (script, moduleName, actions) {
    try {
      let define = definer.defineModule(moduleName)
      // eslint-disable-next-line
      new Function('define', script)(define)
      thunk(actions.clearEvalError)
      app.redraw()
    } catch(e) {
      thunk(actions.handleEvalError, e)
    }
  }, 15)
}

function View(actions) {
  return {
    log,
    screen,
    input,
    error,
    hideScreen,
    showScreen
  }

  function log(message) {
    actions.logFromApp(message)
  }

  function screen(lines) {
    actions.displayOnScreen(lines)
  }

  function input(lines) {
    actions.displayInputPrompt(lines)
  }

  function error(e) {
    console.log(e.stack)
    actions.handleEvalError(e)
  }

  function hideScreen() {
    actions.hideScreen()
  }

  function showScreen() {
    actions.showScreen()
  }
}

definer.defineModule('__VERSE__')({
  *init() {
    yield startInputDisplay(() => [])
    yield startDisplay(() => {
      return tryThings(window)
    })
    if (window.run) {
      if (tryThings(window).length) {
        yield waitForAnyKeyBeforeRunning
      }
      yield startDisplay(() => [])
      yield window.run
    } else {
      yield waitForever
    }
  }
})

function *waitForAnyKeyBeforeRunning() {
  yield startInputDisplay(() => [
    'Press any key to start the *run() function'
  ])
  yield waitForChar()
}

function *waitForever() {
  yield wait(100)
  yield retry()
}

document.body.addEventListener('keydown', event => {
  if (event.target !== document.body) return
  if (!isNonPrintingKey(event) && !modifierKeysPressed(event)) {
    app.receiveKeydown(event)
    event.preventDefault()
  }
})

function modifierKeysPressed(keyEvent) {
  return keyEvent.altKey
    || keyEvent.ctrlKey
    || keyEvent.metaKey
}

function isNonPrintingKey(keyEvent) {
  return keyEvent.key.length > 1
    && keyEvent.key !== 'Backspace'
    && keyEvent.key !== 'Enter'
}
