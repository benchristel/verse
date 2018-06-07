import { has, isGeneratorFunction } from './verse'
import { renameFunction } from './verse/functionalUtils'

export default function Definer(global) {
  let definitions = {}

  return {
    defineModule,
    renameModule,
    deleteModule,
    deleteAllModules,
  }

  function defineModule(moduleName) {
    return function(defns) {
      Object.keys(defns).forEach(name => {
        if (has(name, global) && !definitionsForModule(moduleName).includes(name)) {
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
    if (!has(oldName, definitions)) {
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

  function deleteAllModules() {
    for (let moduleName in definitions) {
      if (has(moduleName, definitions)) {
        deleteModule(moduleName)
      }
    }
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
  if (fn.generatedByVerse) return fn
  let wrapped = null
  if (isGeneratorFunction(fn)) {
    /*
     * The duplication here is intentional; for performance
     * reasons we don't want yet *another* function call in
     * the critical path.
     */
    wrapped = function*() {
      try {
        return yield *fn.apply(null, arguments)
      } catch (e) {
        e.verseStack = e.verseStack || []
        e.verseStack.push(fn.name)
        throw e
      }
    }
  } else {
    wrapped = function() {
      try {
        return fn.apply(null, arguments)
      } catch (e) {
        e.verseStack = e.verseStack || []
        e.verseStack.push(fn.name)
        throw e
      }
    }
  }

  renameFunction(wrapped, () => fn.name)

  return wrapped
}

function mapValues(fn, obj) {
  let result = {}
  for (let k in obj) {
    if (has(k, obj)) {
      result[k] = fn(obj[k])
    }
  }
  return result
}
