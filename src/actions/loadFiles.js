export function loadFiles(objectThatMapsFileNamesToContents) {
  return {
    type: 'loadFiles',
    files: objectThatMapsFileNamesToContents
  }
}
