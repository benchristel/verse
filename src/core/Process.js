import { isIterator, isGeneratorFunction } from './nativeTypes'
import { lastOf } from './sequences'

export function Process(store) {
  let stack = []
  let waitingForEvent = false
  let gotosThisTurn = 0

  /* view caches */
  let error = null
  let logLines = []
  let displayLines = []
  let form = null

  return {
    begin,
    receive,
    submitForm,
    redraw,
  }

  function begin(generator) {
    push(generator)
    run()
    return view()
  }

  function receive(event) {
    // TODO: this check will ultimately become unnecessary.
    // Remove it when done refactoring to use events
    // consistently
    if (waitingForEvent) {
      waitingForEvent = false
      run(event)
    }
    return view()
  }

  function submitForm(data) {
    form = null
    run(data)
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

      case 'waitForEvent':
      gotosThisTurn = 0
      waitingForEvent = true
      return

      case 'putBackEvent':
      run()
      receive(effect.event)
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
    stack.push(saga)
  }

  function pop() {
    updateScreen()
    return stack.pop()
  }

  function updateScreen() {
    let render, i
    for (i = stack.length - 1; i >= 0; i--) {
      if (!render && stack[i].render) {
        render = stack[i].render
        break;
      }
    }

    displayLines = render ? render(store.getState()) : []  }

  function view() {
    return {
      logLines,
      displayLines,
      error,
      form,
    }
  }
}
