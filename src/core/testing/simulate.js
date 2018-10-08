import { Process } from '../Process'
import { Store } from '../Store'
import { assert } from '../assert'
import { isExactly } from '../functionalUtils'
import { indent } from '../strings'
import { isGeneratorFunction, isIterator } from '../nativeTypes'
import { or } from '../predicates'
import { renameFunction } from'../higherOrderFunctions'
import { checkArgs } from '../checkArgs'

const simulate_interface = {
  example: [renameFunction(function*() {}, () => 'run')],
  types: [or(isGeneratorFunction, isIterator)]
}

export function Simulator(globalObject) {
  return function simulate(routine) {
    checkArgs(simulate, arguments, simulate_interface)
    const getStateType = globalObject.getStateType || (() => ({}))
    const reducer = globalObject.reducer
    let store = Store(getStateType(), reducer)
    let process = Process(store)
    process.begin(routine)

    let self
    return self = {
      assertDisplay,
      receive,
      do: _do,
    }

    function assertDisplay(predicate, ...args) {
      let view = process.redraw()
      if (view.error !== null) {
        throw new Error('The simulated program crashed.\nThe error was:\n' + indent('' + view.error))
      }
      assert(view.error, isExactly, null)
      assert(view.displayLines.join('\n'), predicate, ...args)
      return self
    }

    function receive(event) {
      process.receive(event)
      return self
    }

    function _do(fn) {
      fn(self)
      return self
    }
  }
}
