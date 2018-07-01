import Definer from '../Definer'
import { Bard, Store, has } from './index'
import init from './init'

export default function Environment(onOutput) {
  const definer = Definer(window)
  let runningApp = null
  let stagedModules = {}
  let view = blankView()

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
    if (runningApp) runningApp.stop()
    view = blankView()
    for (let name in stagedModules) {
      if (has(name, stagedModules)) {
        evalModule(name, stagedModules[name])
      }
    }

    const getStateType = window.getStateType || (() => ({}))
    const reducer = window.reducer
    runningApp = Bard(
      Store(getStateType(), reducer),
      v => {
        view = {...view, ...v}
        onOutput(view)
      })
    stagedModules = {}
    runningApp.begin(init)
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
    try {
      const define = definer.defineModule(filename)
      // eslint-disable-next-line
      new Function('define', code)(define)
      view = clearSyntaxErrorFrom(view, filename)
    } catch (error) {
      view = recordSyntaxErrorOn(view, filename, error)
    }
  }

  function clearSyntaxErrorFrom(view, filename) {
    return {
      ...view,
      syntaxErrors: exclude(filename, view.syntaxErrors)
    }
  }

  function recordSyntaxErrorOn(view, filename, error) {
    return {
      ...view,
      syntaxErrors: {
        ...view.syntaxErrors,
        [filename]: error
      }
    }
  }

  function blankView() {
    return {
      logLines: [],
      displayLines: [],
      inputLines: [],
      error: null,
      syntaxErrors: {}, // maps filenames to Errors
    }
  }
}

function exclude(name, object) {
  let copy = {...object}
  delete copy[name]
  return copy
}
