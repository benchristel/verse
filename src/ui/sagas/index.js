import { delay } from 'redux-saga'
import { fork, put, take, takeLatest, select } from 'redux-saga/effects'
import { AnimationFrameTicker } from './AnimationFrameTicker'
import { KeyEventStream } from './KeyEventStream'
import { display, markSyntaxErrors, loadFiles } from '../actions'
import { editorText } from '../selectors'
import { findSyntaxErrorLocations } from '../findSyntaxErrorLocations'
import { Core } from '../../core'
import storage from '../storage'

const core = Core()

// - save every file that has run and has no load errors
// - files should have UUIDs. Names should be user-facing
//   labels only. Names need not be unique.
// - each file should have a state machine indicating whether it is loaded, saved.
// saved (initial state) -[edit]-> dirty -> loaded -> saved
// - if a file is dirty Verse should attempt to load it on any change to any file.
// - likewise, if a file is loaded, Verse should attempt to save it whenever any files are saved.

export function* main() {
  yield takeLatest('allowJsToRun', allowJsToRun)
  yield takeLatest('runApp', runApp)
  yield takeLatest('changeEditorText', processFileChange)
  yield takeLatest('loadFiles', deployAllFiles)
  yield fork(animationFrameThread)
  yield fork(keyEventThread)

  yield *readCodeFromStorage()
  yield *checkSyntax()
}

function *readCodeFromStorage() {
  yield put(loadFiles(storage.load()))
}

function* checkSyntax() {
  yield delay(300)
  let code = yield select(editorText)
  yield put(markSyntaxErrors(findSyntaxErrorLocations(code)))
}

function *allowJsToRun() {
  let view = core.run()
  yield put(display(view))
}

function *runApp() {
  yield delay(1)
  let view = core.run()
  yield put(display(view))
}

function *processFileChange({text, file}) {
  // TODO: yield put(markFile('dirty', file))

  /* Delay to allow the editor UI to update synchronously,
   * without being blocked by code eval'ing. */
  yield delay(1)

  let view = core.deploy(file, text)
  /* Deploying code may output errors or changes to the
   * program's display, so send those to the UI. */
  yield put(display(view))

  if (view.syntaxErrors[file]) {
    /* Give the user time to correct the error before
     * distracting them with highlighting. */
    yield delay(300)
    let errors = findSyntaxErrorLocations(text)
    yield put(markSyntaxErrors(errors))
    /* Note that we don't save files with syntax errors.
     * This means if you really screw something up you can
     * refresh the page to get back to a state where the
     * code compiles. */
  } else {
    /* The code loaded successfully, so save it.
     * Delay so we don't save too often. Browser storage
     * can be pretty slow... */
    yield delay(1000)
    storage.storeFile(file, text)
  }
}

function *deployAllFiles({files}) {
  if (files['main.js'] !== undefined) {
    let view = core.deploy('main.js', files['main.js'])
    yield put(display(view))
  }
}

function *animationFrameThread() {
  const frameChannel = AnimationFrameTicker()
  while (1) {
    let elapsedFrames = yield take(frameChannel)
    let view = core.tickFrames(elapsedFrames)
    yield put(display(view))
  }
}

function *keyEventThread() {
  const keyEventStream = KeyEventStream()
  while (1) {
    let event = yield take(keyEventStream)
    let view = core.receiveKeydown(event)
    yield put(display(view))
  }
}
