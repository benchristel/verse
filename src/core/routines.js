/**
 * routine() converts a generator function to a Verse
 * routine.
 *
 * There are some subtle differences between these concepts:
 * - from the outside, a routine looks like a normal (non-
 *   generator) function, but it returns an iterable.
 * - the iterable returned by a routine has a `routine`
 *   property that points to the routine that spawned it.
 *   This allows Process to do crazy things like jump back
 *   to the beginning of a routine on the stack, given a
 *   reference to its iterable.
 */

const verseRoutine = Symbol()

export function routine(generatorFn) {
  if (isRoutine(generatorFn)) {
    return generatorFn
  }

  let invoke = function(...args) {
    let invocation = (function*() {
      try {
        return yield *generatorFn(...args)
      } catch (e) {
        e.verseStack = e.verseStack || []
        e.verseStack.push(generatorFn.name)
        throw e
      }
    })()
    invocation.routine = invoke
    invocation.args = args
    return invocation
  }
  invoke[verseRoutine] = true
  return invoke
}

function isRoutine(a) {
  return !!a[verseRoutine]
}
