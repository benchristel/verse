import Definer from './Definer'
import { has } from './objects'
import { Store } from './Store'
import { Process } from './Process'
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
    receiveKeydown,
    perform
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

  function run(routineCallExpression) {
    if (runningApp) runningApp.stop()
    view = blankView()
    for (let name in stagedModules) {
      if (has(name, stagedModules)) {
        evalModule(name, stagedModules[name])
      }
    }

    { /* start the process with a fresh store */
      const getStateType = window.getStateType || (() => ({}))
      const reducer = window.reducer
      runningApp = Process(
        Store(getStateType(), reducer),
        v => {
          view = {...view, ...v}
          onOutput(view)
        })
    }

    stagedModules = {}
    if (routineCallExpression) {
      try {
        const routine = (e => e(routineCallExpression))(eval)
        runningApp.begin(routine)
      } catch (error) {
        view = {...view, error}
        onOutput(view)
      }
    } else {
      runningApp.begin(init)
    }
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

  function perform(actionExpression) {
    if (runningApp) {
      try {
        const action = (e => e(actionExpression))(eval)
        runningApp.perform(action)
      } catch (error) {
        view = {...view, error}
        onOutput(view)
      }
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
