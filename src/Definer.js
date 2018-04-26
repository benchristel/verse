export default function Definer(global) {
  let definitions = {}

  return {
    defineModule,
    renameModule,
    deleteModule
  }

  function defineModule(moduleName) {
    return function(defns) {
      Object.keys(defns).forEach(name => {
        if (hasOwnProperty(global, name) && !definitionsForModule(moduleName).includes(name)) {
          throw Error('The definition of ' + name +
            ' in ' + moduleName +
            ' overwrites another definition. Please rename '
            + name + ' to something else.')
        }
      })
      deleteModule(moduleName)
      setDefinitionsForModule(moduleName, Object.keys(defns))
      Object.assign(global, mapValues(wrapInErrorHandling, defns))
    }
  }

  function renameModule(oldName, newName) {
    if (!hasOwnProperty(definitions, oldName)) {
      throw Error('No module named ' + oldName + ' exists')
    }
    definitions[newName] = definitions[oldName]
    delete definitions[oldName]
  }

  function deleteModule(moduleName) {
    definitionsForModule(moduleName).forEach(name => {
      delete global[name]
    })
    delete definitions[moduleName]
  }

  function definitionsForModule(moduleName) {
    return definitions[moduleName] || []
  }

  function setDefinitionsForModule(moduleName, names) {
    definitions[moduleName] = names
  }
}

function wrapInErrorHandling(fn) {
  if (typeof fn !== 'function') return fn
  if (isGeneratorFunction(fn)) {
    return function*() {
      try {
        return yield *fn.apply(null, arguments)
      } catch (e) {
        e.verseStack = e.verseStack || []
        e.verseStack.push(fn.name)
        throw e
      }
    }
  }

  return function() {
    try {
      return fn.apply(null, arguments)
    } catch (e) {
      e.verseStack = e.verseStack || []
      e.verseStack.push(fn.name)
      throw e
    }
  }
}

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

// todo this function is defined in verse.js too
function isGeneratorFunction(a) {
  return Object.prototype.toString.call(a) === '[object GeneratorFunction]'
}

function mapValues(fn, obj) {
  let result = {}
  for (let k in obj) {
    if (hasOwnProperty(obj, k)) {
      result[k] = fn(obj[k])
    }
  }
  return result
}
