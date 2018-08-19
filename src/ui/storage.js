export default LocalStorage()

function LocalStorage() {
  let prefix = 'file:'

  return {
    load() {
      let files = {}

      if (standaloneAppCodeElement()) {
        return {
          'main.js': standaloneAppCodeElement().innerText
        }
      }

      Object.keys(localStorage)
        .filter(key => key.indexOf(prefix) === 0)
        .map(key => [key.slice(prefix.length), localStorage[key]])
        .forEach(([filename, content]) => files[filename] = content)

      return files
    },

    storeFile(name, content) {
      localStorage[prefix + name] = content
    }
  }
}

function standaloneAppCodeElement() {
  return document.getElementById('app-code')
}
