import { isIterator, isGeneratorFunction, isArray } from './nativeTypes'
import { doWith } from './functionalUtils'
import { lastOf, map } from './sequences'
import { asText } from './formatting'


export function Process(store) {
  let stack = []
  let gotosThisTurn = 0

  // a unique, random identifier for form submissions.
  let formId = 0

  /* view caches */
  let error = null
  let displayLines = []
  let form = []

  return {
    begin,
    receive,
    redraw,
  }

  function begin(generator) {
    push(generator)
    run()
    return view()
  }

  function receive(event) {
    run(event)
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

    switch (effect.effectType) {
      case 'perform':
      store.emit(effect.action)
      run(store.getState())
      return

      case 'waitForEvent':
      gotosThisTurn = 0
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
      {
        let routine = lastOf(stack)
        routine.render = effect.render
        run()
        return
      }

      case 'showFormFields':
      form = effect.fields
      formId = bigRandom()
      run()
      return

      case 'redraw':
      updateScreen()
      run()
      return

      case 'getCurrentCall':
      run(lastOf(stack).id)
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
    routine.id = Symbol()
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
      formId,
    }
  }
}

function asArray(value) {
  return isArray(value) ? value : [value]
}

// The largest integer JavaScript numbers can precisely
// represent. big + 1 === big; big - 1 < big.
const big = Math.pow(2, 53)
function bigRandom() {
  return Math.floor(Math.random() * big)
}
