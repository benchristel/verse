export function markSyntaxErrors(syntaxErrorLocations) {
  return {
    type: 'markSyntaxErrors',
    syntaxErrorLocations
  }
}
