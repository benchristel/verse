export function editorText(state) {
  let file = state.files[state.currentlyEditingFile]
  if (!file) return ''
  return file.text
}
