export default function chromeStackParser(stack) {
  if (!stack) return {line: null}

  try {
    let lines = stack.split('\n')
    let lineNo = parseInt(lines[1].slice(lines[1].indexOf('<anonymous>')).match(/[0-9]+/)[0], 10)
    return {line: lineNo - 2}
  } catch (e) {
    console.error('error parsing stack', e)
    return {line: null}
  }
}
