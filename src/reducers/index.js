const initialState = {
  menuOpen: false,
  appUi: {
    logs: []
  }
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

    default:
    return state
  }
}
