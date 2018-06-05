import Definer from '../Definer'

export default function Environment(onOutput) {
  const definer = Definer(window)
  let running = false

  // definer.defineModule('__VERSE__')({
  //   *init() {
  //     yield startInputDisplay(() => [])
  //     yield startDisplay(() => {
  //       if (window.displayText) {
  //         try {
  //           return ['' + window.displayText()]
  //         } catch (e) {
  //           return ['ERROR: ' + e.message]
  //         }
  //       } else {
  //         return []
  //       }
  //     })
  //     if (window.run) {
  //       if (window.displayText) {
  //         yield waitForAnyKeyBeforeRunning
  //       }
  //       yield startDisplay(() => [])
  //       yield window.run
  //     } else {
  //       yield waitForever
  //     }
  //   }
  // })
  //
  // function *waitForAnyKeyBeforeRunning() {
  //   yield startInputDisplay(() => [
  //     'Press any key to start the *run() function'
  //   ])
  //   yield waitForChar()
  // }
  //
  // function *waitForever() {
  //   yield wait(100)
  //   yield retry()
  // }

  return {
    deploy,
    run,
    clean
  }

  function deploy(filename, code) {
    const define = definer.defineModule(filename)
    // eslint-disable-next-line
    new Function('define', code)(define)
    updateOutput()
  }

  function run() {
    running = true
    updateOutput()
  }

  function clean() {
    definer.deleteModule('main.js')
  }

  /* PRIVATE METHODS */

  function updateOutput() {
    if (running) {
      onOutput({
        logLines: [],
        displayLines: [window.displayText()],
        inputLines: [],
        syntaxError: '',
        testFailure: '',
        crash: ''
      })
    }
  }
}
