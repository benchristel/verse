import { delay } from 'redux-saga'
import { put, takeLatest, select } from 'redux-saga/effects'
import { markSyntaxErrors } from '../actions'
import { anySyntaxErrors, editorText } from '../selectors'
import { findSyntaxErrorLocations } from '../findSyntaxErrorLocations'
import { core } from '../core'
import storage from '../storage'

function* checkSyntax() {
  yield delay(300)
  let code = yield select(editorText)
  yield put(markSyntaxErrors(findSyntaxErrorLocations(code)))
}

function *runApp() {
  yield delay(1)
  core.run()
}

function *deployFile({text, file}) {
  yield delay(15)
  core.deploy(file, text)
}

function *save({text, file}) {
  yield delay(1000)
  if (yield select(anySyntaxErrors)) {
    console.log('not saving; there are errors')
    // don't save
  } else {
    console.log('saving')
    // TODO: what about other files that may be unsaved?
    yield storage.storeFile(file, text)
  }
}

function *deployAllFiles({files}) {
  yield delay(0) // make the compiler happy
  if (files['main.js'] !== undefined) {
    core.deploy('main.js', files['main.js'])
  }
}

export function* main() {
  yield takeLatest('runApp', runApp)
  yield takeLatest('changeEditorText', checkSyntax)
  yield takeLatest('changeEditorText', deployFile)
  yield takeLatest('changeEditorText', save)
  yield takeLatest('loadFiles', deployAllFiles)

  yield *checkSyntax()
}
