import sideEffects from '../sideEffects'

export function changeEditorText(text) {
  sideEffects.evaluateScript(text)
  return {
    type: 'changeEditorText',
    text
  }
}
