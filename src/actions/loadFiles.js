import sideEffects from '../sideEffects'

export function loadFiles(objectThatMapsFileNamesToContents, actions) {
  for (let name in objectThatMapsFileNamesToContents) {
    if (window.has(name, objectThatMapsFileNamesToContents)) {
      let contents = objectThatMapsFileNamesToContents[name]
      sideEffects.evaluateScript(contents, name, actions)
    }
  }

  return {
    type: 'loadFiles',
    files: objectThatMapsFileNamesToContents
  }
}
