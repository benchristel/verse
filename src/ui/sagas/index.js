import { delay } from 'redux-saga'
import { fork, put, take, takeLatest, select } from 'redux-saga/effects'
import { AnimationFrameTicker } from './AnimationFrameTicker'
import { KeyEventStream } from './KeyEventStream'
import { display, markSyntaxErrors, loadFiles } from '../actions'
import { anySyntaxErrors, editorText } from '../selectors'
import { findSyntaxErrorLocations } from '../findSyntaxErrorLocations'
import { Core } from '../../core'
import storage from '../storage'

const core = Core()

export function* main() {
  yield takeLatest('allowJsToRun', allowJsToRun)
  yield takeLatest('runApp', runApp)
  yield takeLatest('changeEditorText', checkSyntax)
  yield takeLatest('changeEditorText', deployFile)
  yield takeLatest('changeEditorText', save)
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

function *deployFile({text, file}) {
  yield delay(15)
  let view = core.deploy(file, text)
  yield put(display(view))
}

function *save({text, file}) {
  yield delay(1000)
  if (yield select(anySyntaxErrors)) {
    // don't save
  } else {
    // TODO: what about other files that may be unsaved?
    storage.storeFile(file, text)
  }
}

function *deployAllFiles({files}) {
  yield delay(0) // make the compiler happy
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
