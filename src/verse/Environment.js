import Definer from '../Definer'
import { Bard, Store, has } from './index'
import init from './init'

export default function Environment(onOutput) {
  const definer = Definer(window)
  let runningApp = null
  let stagedModules = {}
  let view = {}

  return {
    deploy,
    run,
    clean,
    receiveKeydown
  }

  function deploy(filename, code) {
    if (runningApp) {
      evalModule(filename, code)
      runningApp.redraw()
      onOutput(view)
    } else {
      stagedModules[filename] = code
    }
  }

  function run() {
    for (let name in stagedModules) {
      if (has(name, stagedModules)) {
        evalModule(name, stagedModules[name])
      }
    }
    const getStateType = window.getStateType || {} // (() => ({}))
    const reducer = window.reducer
    runningApp = Bard(
      Store(getStateType, reducer),
      v => view = v)
    stagedModules = {}
    runningApp.begin(init)
    onOutput(view)
  }

  /**
   * clean() is intended for use only by tests
   */
  function clean() {
    definer.deleteAllModules()
  }

  function receiveKeydown(event) {
    if (runningApp) {
      runningApp.receiveKeydown(event)
      onOutput(view)
    }
  }

  /* PRIVATE METHODS */

  function evalModule(filename, code) {
    const define = definer.defineModule(filename)
    // eslint-disable-next-line
    new Function('define', code)(define)
  }
}
