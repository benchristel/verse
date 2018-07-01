import sideEffects from '../sideEffects'

export function changeEditorText(text, file) {
  sideEffects.evaluateScript(file, text)
  return {
    type: 'changeEditorText',
    text,
    file
  }
}
