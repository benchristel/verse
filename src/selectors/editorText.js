export function editorText(state) {
  return state.files[state.currentlyEditingFile] || ''
}
