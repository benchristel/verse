import Definer from './Definer'
import { has } from './objects'
import { Store } from './Store'
import { Process } from './Process'
import init from './init'

export function Core() {
  const definer = Definer(window)
  let runningApp = null
  let stagedModules = {}
  let view = blankView()

  return {
    deploy,
    run,
    clean,
    receiveKeydown,
    tickFrames,
  }

  function deploy(filename, code) {
    if (runningApp) {
      evalModule(filename, code)
      view = {...view, ...runningApp.redraw()}
    } else {
      stagedModules[filename] = code
    }
    return view
  }

  function run() {
    view = blankView()
    for (let name in stagedModules) {
      if (has(name, stagedModules)) {
        evalModule(name, stagedModules[name])
      }
    }

    const getStateType = window.getStateType || (() => ({}))
    const reducer = window.reducer
    runningApp = Process(Store(getStateType(), reducer))
    stagedModules = {}
    view = {...view, ...runningApp.begin(init)}
    return view
  }

  /**
   * clean() is intended for use only by tests
   */
  function clean() {
    definer.deleteAllModules()
  }

  function receiveKeydown(event) {
    if (runningApp) {
      view = {...view, ...runningApp.receiveKeydown(event)}
    }
    return view
  }

  function tickFrames(frames) {
    if (runningApp) {
      view = {...view, ...runningApp.tickFrames(frames)}
    }
    return view
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
