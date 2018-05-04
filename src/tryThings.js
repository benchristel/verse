export default function tryThings(context) {
  return Object.keys(context)
    .filter(s => s.startsWith('try '))
    .filter(fname => typeof context[fname] === 'function')
    .map(fname => {
      try {
        return [fname, '' + context[fname]()]
      } catch (e) {
        return [fname, 'ERROR: ' + e.message]
      }
    })
    .reduce((a,b) => a.concat(b), [])
}
