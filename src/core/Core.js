import Definer from './Definer'
import { has } from './objects'
import { Store } from './Store'
import { Process } from './Process'
import { get, tuple, startsWith } from './functionalUtils'
import { blankView } from './view'
import { animationFrame, keyDown } from './events'
import init from './init'
import { isFunction } from './nativeTypes'

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
      let testResults = runTests(getTestFunctions(window))
      view = {
        ...view,
        testResults,
        ...runningApp.redraw()
      }
    } else {
      stagedModules[filename] = code
    }
    return view
  }

  function run() {
    view = clearAppView(view)
    for (let name in stagedModules) {
      if (has(name, stagedModules)) {
        evalModule(name, stagedModules[name])
      }
    }

    if (!runningApp) {
      let testResults = runTests(getTestFunctions(window))
      view = {
        ...view,
        testResults
      }
    }

    const getStateType = window.getStateType || (() => ({}))
    const reducer = window.reducer
    let stateType
    try {
      stateType = getStateType()
      runningApp = Process(Store(stateType, reducer))
    } catch (error) {
      view = {...view, error}
      return view
    }
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
      view = {...view, ...runningApp.receive(keyDown(event.key))}
    }
    return view
  }

  function tickFrames(frames) {
    if (runningApp) {
      view = {
        ...view,
        ...runningApp.receive(animationFrame(frames))
      }
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

  function clearAppView(view) {
    return {
      ...blankView(),
      syntaxErrors: view.syntaxErrors,
      testResults: view.testResults
    }
  }
}

function exclude(name, object) {
  let copy = {...object}
  delete copy[name]
  return copy
}

function runTests(tests) {
  return tests
    .map(tuple([get('name'), getFailure]))
    .reduce((results, [name, error]) => {
      results[name] = error
      return results
    }, {})

  function getFailure(test) {
    try {
      test()
    } catch (failure) {
      return failure
    }
    return null
  }
}

function getTestFunctions(global) {
  return Object.values(global)
    .filter(isFunction)
    .filter(({name}) => startsWith('test ', name))
}
