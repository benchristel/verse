import { isIterator, isGeneratorFunction, lastOf } from '.'

export function Process(store, view) {
  let stack = []
  let waitingForChar = false
  let waitTimeout = null

  /* view caches */
  let error = null
  let logLines = []
  let displayLines = []
  let inputLines = []
  let gotosThisTurn = 0

  return {
    begin,
    receiveKeydown,
    stop,
    redraw,
  }

  function begin(generator) {
    push(generator)
    run()
  }

  function receiveKeydown({key}) {
    if (!waitingForChar) return
    run(key)
  }

  function stop() {
    while (stack.length) pop()
    /* Clearing the timeout does not affect behavior--
     * once all stack frames are popped, the timer callback
     * is a no-op. However, clearing it removes a reference
     * to this Process that would otherwise prevent it from
     * being garbage-collected. */
    clearTimeout(waitTimeout)
  }

  function redraw() {
    handleErrors(updateScreen)
  }

  function run(returnFromYield) {
    handleErrors(() => runOrThrow(returnFromYield))
  }

  function handleErrors(mightFail) {
    if (error) {
      outputView()
      return
    }
    try {
      error = null
      mightFail()
    } catch (e) {
      error = e
      outputView()
    }
  }

  function runOrThrow(returnFromYield) {
    waitingForChar = false
    waitTimeout = null
    let saga

    // TODO: a limit of 100 is really small. Optimize
    // UI rendering so it can be set higher
    if (gotosThisTurn > 100) throw new Error('Infinite retry loop detected')

    if (!stack.length) return
    let {value: effect, done} = lastOf(stack).next(returnFromYield)

    if (done) {
      pop()
      run(effect)
      return
    }

    if (isGeneratorFunction(effect)) {
      gotosThisTurn++
      push(effect)
      run()
      return
    }

    if (isIterator(effect)) {
      gotosThisTurn++
      push(effect)
      run()
      return
    }

    switch (effect.effectType) {
      case 'perform':
      store.emit(effect.action)
      run()
      return

      case 'waitForChar':
      gotosThisTurn = 0
      updateScreen()
      waitingForChar = true
      return

      case 'wait':
      gotosThisTurn = 0
      updateScreen()
      waitTimeout = setTimeout(run, effect.seconds * 1000)
      return

      case 'waitForever':
      gotosThisTurn = 0
      updateScreen()
      return

      case 'jump':
      gotosThisTurn++
      while (stack.length) pop()
      push(effect.generator)
      run()
      return

      case 'retry':
      gotosThisTurn++
      pop()
      push(effect.generator)
      run()
      return

      case 'log':
      logLines.push(effect.message)
      outputView()
      run()
      return

      case 'startDisplay':
      saga = lastOf(stack)
      saga.render = effect.render
      updateScreen()
      run()
      return

      case 'startInputDisplay':
      saga = lastOf(stack)
      saga.inputRender = effect.render
      updateScreen()
      run()
      return

      default:
      error = new Error('You `yield`ed something weird: ' + JSON.stringify(effect))
      outputView()
      return
    }
  }

  function push(generator) {
    let saga =
      isIterator(generator) ?
      generator : generator()
    saga.render = null
    saga.inputRender = null
    stack.push(saga)
  }

  function pop() {
    updateScreen()
    return stack.pop()
  }

  function updateScreen() {
    let render, inputRender, i
    for (i = stack.length - 1; i >= 0; i--) {
      if (!render && stack[i].render) {
        render = stack[i].render
      }
      if (!inputRender && stack[i].inputRender) {
        inputRender = stack[i].inputRender
      }
      if (render && inputRender) break;
    }

    displayLines = render ? render(store.getState()) : []
    inputLines = inputRender ? inputRender(store.getState()) : []
    outputView()
  }

  function outputView() {
    view({
      logLines,
      displayLines,
      inputLines,
      error,
    })
  }
}
