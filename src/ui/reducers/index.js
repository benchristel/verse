import { combineReducers } from 'redux'

export default combineReducers({
  appUi: combineReducers({
    logs,
    screenLines,
    inputLines
  }),
  files,
  currentlyEditingFile,
  isErrorPanelShown,
  syntaxErrorLocations,
  testResults,
  crash,
  currentlyInspectingStage,
})

function logs(curr=[], action) {
  switch (action.type) {
    case 'display':
    return action.logLines

    default:
    return curr
  }
}

function screenLines(curr=[], action) {
  switch (action.type) {
    case 'display':
    return action.displayLines

    default:
    return curr
  }
}

function inputLines(curr=[], action) {
  switch (action.type) {
    case 'display':
    return action.inputLines

    default:
    return curr
  }
}

function files(curr={}, action) {
  switch (action.type) {
    case 'loadFiles':
    return map(text => ({text, syntaxError: null}), action.files)

    case 'changeEditorText': {
      const {file, text} = action
      return {
        ...curr,
        [file]: {
          ...curr[file],
          text
        }
      }
    }

    case 'display':
    return map((file, name) => {
      let error = action.syntaxErrors[name] || null
      return {
        ...file,
        syntaxError: error
      }
    }, curr)

    default:
    return curr
  }
}

function currentlyEditingFile(curr='main.js', action) {
  return curr
}

function isErrorPanelShown(curr=false, action) {
  switch (action.type) {
    case 'showErrorPanel':
    return true

    case 'hideErrorPanel':
    return false

    case 'display':
    if (!action.error && isEmpty(action.syntaxErrors)) {
      return false
    } else {
      return curr
    }

    default:
    return curr
  }
}

function syntaxErrorLocations(curr=[], action) {
  switch (action.type) {
    case 'changeEditorText':
    return []

    case 'markSyntaxErrors':
    return action.syntaxErrorLocations

    default:
    return curr
  }
}

function testResults(curr={}, action) {
  switch (action.type) {
    case 'display':
    return action.testResults

    default:
    return curr
  }
}

function crash(curr=null, action) {
  switch (action.type) {
    case 'display':
    return action.error

    default:
    return curr
  }
}

function currentlyInspectingStage(curr='run', action) {
  switch (action.type) {
    case 'inspectStage':
    return action.stage

    default:
    return curr
  }
}

function map(fn, object) {
  let result = {}
  for (let prop in object) {
    if (object.hasOwnProperty(prop)) {
      result[prop] = fn(object[prop], prop)
    }
  }
  return result
}

function isEmpty(object) {
  for (let prop in object) return false
  return true
}
