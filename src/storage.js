let urlHash = hash(window.location.toString())
let prefix = 'file:' + urlHash + ':'

export default {
  files() {
    let files = {}

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

function hash(string) {
  let sjcl = window.sjcl
  let sha256 = new sjcl.hash.sha256()
  sha256.update(string)
  return sjcl.codec.base64.fromBits(sha256.finalize())
}
