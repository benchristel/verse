export default function tryThings(context, handleError) {
  return Object.keys(context)
    .filter(s => s.startsWith('try '))
    .filter(fname => typeof context[fname] === 'function')
    .map(fname => {
      try {
        return [fname, '' + context[fname]()]
      } catch (e) {
        handleError(e)
        return []
      }
    })
    .reduce((a,b) => a.concat(b), [])
}
