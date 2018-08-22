import { Process } from '../Process'
import { Store } from '../Store'
import { assert } from '../assert'
import { isExactly } from '../functionalUtils'

export function Simulator(globalObject) {
  return function simulate(routine) {
    const getStateType = globalObject.getStateType || (() => ({}))
    const reducer = globalObject.reducer
    let store = Store(getStateType, reducer)
    let process = Process(store)
    process.begin(routine)

    let self
    return self = {
      assertDisplay,
      receive
    }

    function assertDisplay(predicate, ...args) {
      let view = process.redraw()
      assert(view.error, isExactly, null)
      assert(view.displayLines.join('\n'), predicate, ...args)
      return self
    }

    function receive(event) {
      process.receive(event)
      return self
    }
  }
}
