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
      Object.assign(global, defns)
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

  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }
}
