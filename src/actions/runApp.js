import sideEffects from '../sideEffects'

export function runApp(actions) {
  sideEffects.runApp(actions)
  return {
    type: 'runApp'
  }
}
