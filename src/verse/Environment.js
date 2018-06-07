import Definer from '../Definer'
import { Bard, Store } from './index'

export default function Environment(onOutput) {
  const definer = Definer(window)
  let bard = null
  let logLines = []
  let displayLines = []
  let inputLines = []
  let stagedModules = {}

  return {
    deploy,
    run,
    clean,
    keydown
  }

  function deploy(filename, code) {
    if (isRunning()) {
      const define = definer.defineModule(filename)
      // eslint-disable-next-line
      new Function('define', code)(define)
      bard.redraw()
      updateOutput()
    } else {
      stagedModules[filename] = code
    }
  }

  function run() {
    bard = Bard(Store({}, a => a), {
      log: l => logLines = [l], //TODO
      screen: s => displayLines = s,
      input: i => inputLines = i,
      error(e) { console.log(e) }, // TODO
    })
    for (let name in stagedModules) {
      if (has(name, stagedModules)) {
        deploy(name, stagedModules[name])
      }
    }
    bard.begin(init)
    updateOutput()
  }

  function clean() {
    definer.deleteAllModules()
  }

  function keydown(event) {
    if (isRunning()) {
      bard.receiveKeydown(event)
      updateOutput()
    }
  }

  /* PRIVATE METHODS */

  function updateOutput() {
    if (isRunning()) {
      onOutput({
        logLines,
        displayLines,
        inputLines,
        syntaxError: '',
        testFailure: '',
        crash: ''
      })
    }
  }

  function isRunning() {
    return !!bard
  }
}

/* APPLICATION STARTUP ROUTINES */

function *init() {
  yield startInputDisplay(() => [])
  yield startDisplay(() => {
    if (window.displayText) {
      try {
        return ['' + window.displayText()]
      } catch (e) {
        return ['ERROR: ' + e.message]
      }
    } else {
      return []
    }
  })
  if (window.run) {
    if (window.displayText) {
      yield waitForAnyKeyBeforeRunning
    }
    yield startDisplay(() => [])
    yield window.run
  } else {
    yield waitForever
  }
}

function *waitForAnyKeyBeforeRunning() {
  yield startInputDisplay(() => [
    'Press any key to start the *run() function'
  ])
  yield waitForChar()
}

function *waitForever() {
  yield wait(100)
  yield retry()
}
