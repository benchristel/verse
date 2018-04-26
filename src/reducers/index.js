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
  isErrorPanelShown
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
    case 'logFromApp':
    return [...curr, action.message]

    default:
    return curr
  }
}

function screenLines(curr=[], action) {
  switch (action.type) {
    case 'displayOnScreen':
    return action.lines

    default:
    return curr
  }
}

function inputLines(curr=[], action) {
  switch (action.type) {
    case 'displayInputPrompt':
    return action.lines

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
  }
  return curr
}
