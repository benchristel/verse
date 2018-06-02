export function findEndOfToken(index, text) {
  let identifierRegex = /[A-Za-z0-9_$]/
  let whitespaceRegex = /\s/
  let isIdentifier = identifierRegex.test(text[index])
  for (let i = index + 1; i < text.length; i++) {
    let ch = text[i]

    if (   whitespaceRegex.test(ch)
        || identifierRegex.test(ch) !== isIdentifier) {

      return i
    }
  }
  return text.length
}
