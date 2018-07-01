import { connect } from 'react-redux'
import * as actions from '../actions'

export default function(component) {
  return connect(state => state, mapDispatchToState)(component)
}

function mapDispatchToState(dispatch) {
  let mappedActions = {}
  for (let action in actions) {
    if (Object.prototype.hasOwnProperty.call(actions, action)) {
      mappedActions[action] = function(...args) {
        return dispatch(actions[action](...args))
      }
    }
  }
  return mappedActions
}
