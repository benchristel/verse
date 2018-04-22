import sideEffects from '../sideEffects'

export function loadFiles(objectThatMapsFileNamesToContents, actions) {
  if (window.has('main.js', objectThatMapsFileNamesToContents)) {
    let contents = objectThatMapsFileNamesToContents['main.js']
    sideEffects.evaluateScript(contents, 'main.js', actions)
  }

  return {
    type: 'loadFiles',
    files: objectThatMapsFileNamesToContents
  }
}
