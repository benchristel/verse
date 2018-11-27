import { isIterator, isGeneratorFunction, isArray } from './nativeTypes'
import { doWith } from './functionalUtils'
import { lastOf, map } from './sequences'
import { asText } from './formatting'

export function Process(store) {
  let stack = []
  let waitingForEvent = false
  let gotosThisTurn = 0

  /* view caches */
  let error = null
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
    let routine

    if (gotosThisTurn > 1000) throw new Error('Infinite retry loop detected')

    if (!stack.length) return
    let {value: effect, done} = lastOf(stack).next(returnFromYield)

    if (done) {
      pop()
      run(effect)
      return
    }

    if (isGeneratorFunction(effect) || isIterator(effect)) {
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
      run(store.getState())
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

      case 'startDisplay':
      routine = lastOf(stack)
      routine.render = effect.render
      updateScreen()
      run()
      return

      default:
      error = new Error('You `yield`ed something weird: ' + JSON.stringify(effect))
      return
    }
  }

  function push(generator) {
    let routine =
      isIterator(generator) ?
      generator : generator()
    routine.render = null
    stack.push(routine)
  }

  function pop() {
    updateScreen()
    return stack.pop()
  }

  function updateScreen() {
    let render, i
    for (i = stack.length - 1; i >= 0; i--) {
      if (stack[i].render) {
        render = stack[i].render
        break;
      }
    }

    displayLines = doWith(
      render ? render(store.getState()) : [],
      asArray,
      map(asText))
  }

  function view() {
    return {
      displayLines,
      error,
      form,
    }
  }
}

function asArray(value) {
  return isArray(value) ? value : [value]
}
