import { combineReducers } from 'redux'

export default combineReducers({
  menuOpen,
  appUi: combineReducers({
    logs,
    screenLines,
    inputLines
  }),
  files,
  currentlyEditingFile,
  evalError,
  isErrorPanelShown,
  syntaxErrorLocations,
})

function menuOpen(curr=false, action) {
  switch (action.type) {
    case 'openMenu':
    return true

    case 'closeMenu':
    return false

    default:
    return curr
  }
}

function logs(curr=[], action) {
  switch (action.type) {
    case 'logFromApp': //TODO remove
    return [...curr, action.message]

    case 'display':
    return action.logLines

    default:
    return curr
  }
}

function screenLines(curr=[], action) {
  switch (action.type) {
    case 'displayOnScreen':
    return action.lines

    case 'display':
    return action.displayLines

    default:
    return curr
  }
}

function inputLines(curr=[], action) {
  switch (action.type) {
    case 'displayInputPrompt':
    return action.lines

    case 'display':
    return action.inputLines

    default:
    return curr
  }
}

function files(curr={}, action) {
  switch (action.type) {
    case 'loadFiles':
    return action.files

    case 'changeEditorText':
    return {
      ...curr,
      [action.file]: action.text
    }

    default:
    return curr
  }
}

function currentlyEditingFile(curr='main.js', action) {
  return curr
}

function evalError(curr='', action) {
  switch (action.type) {
    case 'handleEvalError':
    return action.error || ''

    case 'clearEvalError':
    return ''

    case 'display':
    return action.error ? action.error.message : ''

    default:
    return curr
  }
}

function isErrorPanelShown(curr=false, action) {
  switch (action.type) {
    case 'showErrorPanel':
    return true

    case 'hideErrorPanel':
    return false

    case 'clearEvalError':
    return false

    case 'display':
    if (!action.error) {
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
