const initialState = {
  menuOpen: false,
  appUi: {
    logs: [],
    screenLines: [],
    inputLines: []
  },
  files: {},
  currentlyEditingFile: 'main.js',
  evalError: ''
}

export default function(state=initialState, action) {
  switch (action.type) {
    case 'openMenu':
    return {...state, menuOpen: true}

    case 'closeMenu':
    return {...state, menuOpen: false}

    case 'logFromApp':
    return {
      ...state,
      appUi: {
        ...state.appUi,
        logs: [...state.appUi.logs, action.message]
      }
    }

    case 'displayOnScreen':
    return {
      ...state,
      appUi: {
        ...state.appUi,
        screenLines: action.lines
      }
    }

    case 'displayInputPrompt':
    return {
      ...state,
      appUi: {
        ...state.appUi,
        inputLines: action.lines
      }
    }

    case 'changeEditorText':
    return {
      ...state,
      files: {
        ...state.files,
        [state.currentlyEditingFile]: action.text
      }
    }

    case 'loadFiles':
    return {...state, files: {...action.files}}

    case 'handleEvalError':
    return {...state, evalError: action.error}

    case 'clearEvalError':
    return {...state, evalError: ''}

    default:
    return state
  }
}
