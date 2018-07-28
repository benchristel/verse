import { delay } from 'redux-saga'
import { fork, put, take, takeLatest, select } from 'redux-saga/effects'
import { AnimationFrameTicker } from './AnimationFrameTicker'
import { display, markSyntaxErrors } from '../actions'
import { anySyntaxErrors, editorText } from '../selectors'
import { findSyntaxErrorLocations } from '../findSyntaxErrorLocations'
import { core } from '../core'
import storage from '../storage'

export function* main() {
  yield takeLatest('runApp', runApp)
  yield takeLatest('changeEditorText', checkSyntax)
  yield takeLatest('changeEditorText', deployFile)
  yield takeLatest('changeEditorText', save)
  yield takeLatest('loadFiles', deployAllFiles)
  yield fork(animationFrameThread)

  yield *checkSyntax()
}

function* checkSyntax() {
  yield delay(300)
  let code = yield select(editorText)
  yield put(markSyntaxErrors(findSyntaxErrorLocations(code)))
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
    yield storage.storeFile(file, text)
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
