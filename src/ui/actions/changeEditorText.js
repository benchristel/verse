export function changeEditorText(text, file) {
  return {
    type: 'changeEditorText',
    text,
    file
  }
}
