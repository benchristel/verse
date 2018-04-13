let app = window.NullBard()

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

  evaluateScript(script) {
    try {
      new Function(script)()
    } catch(e) {}
  },

  readFilesFromLocalStorage() {
    let files = {}
    Object.keys(localStorage)
      .filter(key => key.indexOf('file:') === 0)
      .map(key => [key.slice('file:'.length), localStorage[key]])
      .forEach(([filename, content]) => files[filename] = content)
    return files
  },

  storeFileInLocalStorage(name, content) {
    localStorage['file:' + name] = content
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

document.body.addEventListener('keypress', event => {
  if (event.target !== document.body) return
  app.receiveKeydown(event)
})
