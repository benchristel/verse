import { eventChannel, buffers } from 'redux-saga'

export function KeyEventStream() {
  return eventChannel(subscribe, buffers.none())
}

function subscribe(listener) {
  document.body.addEventListener('keydown', event => {
    if (event.target !== document.body) return
    if (!isNonPrintingKey(event) && !hasModifier(event)) {
      listener(event)
      event.preventDefault()
    }
  })

  return () => {} // dummy unsubscribe function
}

function hasModifier(keyEvent) {
  return keyEvent.altKey
    || keyEvent.ctrlKey
    || keyEvent.metaKey
}

function isNonPrintingKey(keyEvent) {
  return keyEvent.key.length > 1
    && keyEvent.key !== 'Backspace'
    && keyEvent.key !== 'Enter'
}
