export function action(...argNames) {
  let fn = function(...args) {
    let obj = {}
    for (let i = 0; i < argNames.length; i++) {
      obj[argNames[i]] = args[i]
    }
    obj.type = fn
    return obj
  }
  fn.generatedByVerse = true
  return fn
}
