import sideEffects from '../sideEffects'

export function changeEditorText(text) {
  sideEffects.evaluateScript(text, 'main.js')
  return {
    type: 'changeEditorText',
    text
  }
}
