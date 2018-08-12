export function anyTestFailures(state) {
  return Object.values(state.testResults)
    .some(r => r instanceof Error)
}
