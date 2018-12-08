import { hasKey } from './objects'
import { isGeneratorFunction } from './nativeTypes'
import { renameFunction } from './higherOrderFunctions'
import { mapObject } from './objects'

export default function Definer(global) {
  let definitions = {}
  let userFunctionCallsAllowed = true

  return {
    defineModule,
    renameModule,
    deleteModule,
    deleteAllModules,
    withUserFunctionsDisallowed,
  }

  function defineModule(moduleName) {
    return function(defns) {
      Object.keys(defns).forEach(name => {
        if (hasKey(name, global) && !definitionsForModule(moduleName).includes(name)) {
          throw Error('The definition of ' + name +
            ' in ' + moduleName +
            ' overwrites another definition. Please rename '
            + name + ' to something else.')
        }
      })
      deleteModule(moduleName)
      setDefinitionsForModule(moduleName, Object.keys(defns))
      Object.assign(global, mapObject(wrapInErrorHandling, defns))
    }
  }

  function renameModule(oldName, newName) {
    if (!hasKey(oldName, definitions)) {
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
      if (hasKey(moduleName, definitions)) {
        deleteModule(moduleName)
      }
    }
  }

  function withUserFunctionsDisallowed(doSomething) {
    try {
      userFunctionCallsAllowed = false
      doSomething()
    } finally {
      userFunctionCallsAllowed = true
    }
  }

  function definitionsForModule(moduleName) {
    return definitions[moduleName] || []
  }

  function setDefinitionsForModule(moduleName, names) {
    definitions[moduleName] = names
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
        if (!userFunctionCallsAllowed) {
          throw prematureCallError(fn)
        }
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
}

function prematureCallError(fn) {
  return Error(`Your code called your ${fn.name}() function while the code was still loading.

This usually means you called the function from somewhere that's not inside any other function.

Doing that can cause Verse to get into a weird state, so it's not allowed.
`)
}
