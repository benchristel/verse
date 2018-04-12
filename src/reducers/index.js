const initialState = {
  menuOpen: false,
  appUi: {
    logs: [],
    screenLines: []
  },
  files: {},
  currentlyEditingFile: 'main.js'
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

    default:
    return state
  }
}
