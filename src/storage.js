let storage = null
let token = window.location.hash

if (token.length <= 1) {
  storage = LocalStorage()
} else {
  storage = MemoryStorage()
  // the URL has a unique ID which can be used to validate
  // posted messages
  window.addEventListener('message', ({data}) => {
    if (data.token === token && data.action === 'loadFiles') {
      storage.load(data.files)
    }
  })
}

export default storage

function LocalStorage() {
  let prefix = 'file:'

  return {
    load() {
      throw new Error('not yet implemented')
    },

    onLoad(callback) {
      let files = {}

      Object.keys(localStorage)
        .filter(key => key.indexOf(prefix) === 0)
        .map(key => [key.slice(prefix.length), localStorage[key]])
        .forEach(([filename, content]) => files[filename] = content)

      return callback(files)
    },

    storeFile(name, content) {
      localStorage[prefix + name] = content
    }
  }
}

function MemoryStorage() {
  let onLoadCallback = () => {}
  let files = {}

  return {
    load(_files) {
      files = _files
      onLoadCallback(files)
    },

    onLoad(callback) {
      onLoadCallback = callback
      onLoadCallback(files)
    },

    storeFile(name, content) {
      files[name] = content
    }
  }
}
