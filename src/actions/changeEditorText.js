import sideEffects from '../sideEffects'

export function changeEditorText(text, file, actions) {
  sideEffects.evaluateScript(text, 'main.js', actions)
  return {
    type: 'changeEditorText',
    text,
    file
  }
}
