export default function firefoxStackParser(stack) {
  if (!stack) return {line: null}

  try {
    let firstFrame = stack.split('\n')
      .filter(l => l.includes('> Function'))[0]
    if (!firstFrame) return noLineNumber()

    let lineNo = parseInt(
      firstFrame.slice(firstFrame.indexOf('> Function')).match(/[0-9]+/)[0], 10)
    return {line: lineNo - 2}
  } catch (e) {
    console.error('error parsing stack', e)
    return noLineNumber()
  }
}

function noLineNumber() {
  return {line: null}
}
