import sideEffects from '../sideEffects'

export function changeEditorText(text, actions) {
  sideEffects.evaluateScript(text, 'main.js', actions)
  return {
    type: 'changeEditorText',
    text
  }
}
