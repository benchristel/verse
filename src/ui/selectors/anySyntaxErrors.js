import { getSyntaxErrors } from './getSyntaxErrors'

export function anySyntaxErrors(state) {
  return getSyntaxErrors(state).length > 0
}
