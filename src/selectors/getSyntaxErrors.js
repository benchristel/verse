export function getSyntaxErrors(state) {
  return Object.keys(state.files)
    .map(filename => ({
      file: filename,
      error: state.files[filename].syntaxError
    }))
    .filter(o => o.error)
}
