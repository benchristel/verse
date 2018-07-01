import sideEffects from '../sideEffects'
import { has } from '../../core'

export function loadFiles(objectThatMapsFileNamesToContents, actions) {
  if (has('main.js', objectThatMapsFileNamesToContents)) {
    let contents = objectThatMapsFileNamesToContents['main.js']
    sideEffects.evaluateScript('main.js', contents)
  }

  return {
    type: 'loadFiles',
    files: objectThatMapsFileNamesToContents
  }
}
