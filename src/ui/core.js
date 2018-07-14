import Environment from '../core/Environment'
import nextTurn from './nextTurn'
import store from './store'
import { display } from './actions'

export const core = Environment(view => {
  //TODO: is nextTurn needed here?
  nextTurn(() => store.dispatch(display(view)))
})
