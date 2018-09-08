export function quote(s) {
  return '"' + escape(s) + '"'
}

export function escape(s) {
  return s
    .split('\\').join('\\\\')
    .split('\n').join('\\n')
    .split('"').join('\\"')
}

export function indent(text) {
  let prefix = '  '
  return prefix + text.replace(/\n/g, '\n' + prefix)
}
