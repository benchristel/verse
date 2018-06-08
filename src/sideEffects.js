import nextTurn from './nextTurn'
import Environment from './verse/Environment'
import debounce from 'debounce'
import store from './store'
import { display } from './actions'

let env = Environment(view => {
  //TODO: is nextTurn needed here?
  nextTurn(() => store.dispatch(display(view)))
})

export default {
  runApp(actions) {
    env.run()
  },

  evaluateScript: debounce(function (script, moduleName, actions) {
    try {
      env.deploy(moduleName, script)
    } catch(e) {
      // TODO: incorporate this into Environment's error handling logic
      nextTurn(actions.handleEvalError, e)
    }
  }, 15)
}

document.body.addEventListener('keydown', event => {
  if (event.target !== document.body) return
  if (!isNonPrintingKey(event) && !modifierKeysPressed(event)) {
    env.keydown(event)
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
