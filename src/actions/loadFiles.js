import sideEffects from '../sideEffects'

export function loadFiles(objectThatMapsFileNamesToContents) {
  for (let name in objectThatMapsFileNamesToContents) {
    if (window.has(name, objectThatMapsFileNamesToContents)) {
      let contents = objectThatMapsFileNamesToContents[name]
      sideEffects.evaluateScript(contents, name)
    }
  }

  return {
    type: 'loadFiles',
    files: objectThatMapsFileNamesToContents
  }
}
