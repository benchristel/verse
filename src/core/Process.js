import { isIterator, isGeneratorFunction, lastOf } from '.'

export function Process(store) {
  let stack = []
  let waitingForChar = false
  let framesLeftToWait = 0
  let gotosThisTurn = 0

  /* view caches */
  let error = null
  let logLines = []
  let displayLines = []
  let inputLines = []
  let form = null

  return {
    begin,
    receiveKeydown,
    submitForm,
    tickFrames,
    redraw,
  }

  function begin(generator) {
    push(generator)
    run()
    return view()
  }

  function receiveKeydown({key}) {
    if (waitingForChar) run(key)
    return view()
  }

  function submitForm(data) {
    form = null
    run(data)
    return view()
  }

  function tickFrames(frames) {
    let unconsumedFrames = frames
    while (unconsumedFrames > 0 && framesLeftToWait > 0) {
      if (unconsumedFrames < framesLeftToWait) {
        framesLeftToWait -= unconsumedFrames
        unconsumedFrames = 0
      } else {
        // elapsed frames exceed the wait
        unconsumedFrames -= framesLeftToWait
        framesLeftToWait = 0
        run()
      }
    }
    return view()
  }

  function redraw() {
    handleErrors(updateScreen)
    return view()
  }

  function run(returnFromYield) {
    handleErrors(() => runOrThrow(returnFromYield))
  }

  function handleErrors(mightFail) {
    if (error) return
    try {
      error = null
      mightFail()
    } catch (e) {
      error = e
    }
  }

  function runOrThrow(returnFromYield) {
    waitingForChar = false
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

    if (Object.values(effect).every(v => /*v &&*/ v.definesInputElement)) {
      form = effect
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
      if (effect.seconds > 0) {
        framesLeftToWait = effect.seconds * 60
        updateScreen()
      } else {
        run()
      }
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
  }

  function view() {
    return {
      logLines,
      displayLines,
      inputLines,
      error,
      form,
    }
  }
}
