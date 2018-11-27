export function blankView() {
  return {
    displayLines: [],
    error: null,
    syntaxErrors: {}, // maps filenames to Errors
    testResults: {}, // maps test names to Errors
  }
}
