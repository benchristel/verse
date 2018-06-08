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
    keydown
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
    runningApp = Bard(Store({}, a => a)/*TODO*/, v => view = v)
    for (let name in stagedModules) {
      if (has(name, stagedModules)) {
        evalModule(name, stagedModules[name])
      }
    }
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

  function keydown(event) { // TODO: rename to receiveKeydown
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
