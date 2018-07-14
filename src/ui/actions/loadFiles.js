export function loadFiles(objectThatMapsFileNamesToContents, actions) {
  return {
    type: 'loadFiles',
    files: objectThatMapsFileNamesToContents
  }
}
