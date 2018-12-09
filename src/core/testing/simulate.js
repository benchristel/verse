import { Process } from '../Process'
import { Store } from '../Store'
import { assert } from '../assert'
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
    {
      let view = process.begin(routine)
      rethrowIfError(view.error)
    }

    let self
    return self = {
      assertDisplay,
      form,
      receive,
      do: _do,
    }

    function assertDisplay(predicate, ...args) {
      let view = process.redraw()
      rethrowIfError(view.error)
      assert(view.displayLines.join('\n'), predicate, ...args)
      return self
    }

    function form(predicate, ...args) {
      let view = process.redraw()
      return view.form
    }

    function receive(event) {
      process.receive(event)
      return self
    }

    function _do(fn) {
      fn(self)
      return self
    }

    function rethrowIfError(error) {
      if (error !== null) {
        throw Error('The simulated program crashed.\nThe error was:\n' + indent('' + error))
      }
    }
  }
}
