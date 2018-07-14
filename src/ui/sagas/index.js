import { delay } from 'redux-saga'
import { put, takeLatest, select } from 'redux-saga/effects'
import { markSyntaxErrors } from '../actions'
import { editorText } from '../selectors'
import { findSyntaxErrorLocations } from '../findSyntaxErrorLocations'
import { core } from '../core'

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
  yield takeLatest('loadFiles', deployAllFiles)

  yield *checkSyntax()
}
