import { core } from './core'
import store from './store'
import { cheat } from './actions'

document.body.addEventListener('keydown', event => {
  if (event.target !== document.body) return
  if (!isNonPrintingKey(event) && !modifierKeysPressed(event)) {
    core.receiveKeydown(event)
    event.preventDefault()
  } else if (ctrlEquivalentPressed(event)) {
    console.log('ctrl combo pressed')
    switch (event.key) {
      case 'j':
      event.preventDefault()
      store.dispatch(cheat('jump'))
      return

      case 'p':
      event.preventDefault()
      store.dispatch(cheat('perform'))
      return
    }
  }
})

function ctrlEquivalentPressed(keyEvent) {
  return keyEvent.ctrlKey || keyEvent.metaKey
}

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
