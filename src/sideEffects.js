import Definer from './Definer'

let app = window.NullBard()
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
    app = window.App(appHooks)
  },

  evaluateScript(script, moduleName) {
    try {
      let define = definer.defineModule(moduleName)
      new Function('define', script)(define)
    } catch(e) {}
  }
}

function View(actions) {
  return {
    log,
    screen,
    input,
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

  function hideScreen() {
    actions.hideScreen()
  }

  function showScreen() {
    actions.showScreen()
  }
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
