export function blankView() {
  return {
    logLines: [],
    displayLines: [],
    error: null,
    syntaxErrors: {}, // maps filenames to Errors
    testResults: {}, // maps test names to Errors
  }
}
