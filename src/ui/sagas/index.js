import { delay } from 'redux-saga'
import { put, takeLatest, select } from 'redux-saga/effects'
import { markSyntaxErrors } from '../actions'
import { editorText } from '../selectors'
import { findSyntaxErrorLocations } from '../findSyntaxErrorLocations'

function* checkSyntax() {
  yield delay(300)
  let code = yield select(editorText)
  yield put(markSyntaxErrors(findSyntaxErrorLocations(code)))
}

export function* syntaxErrorCheckingSaga() {
  yield *checkSyntax()
  yield takeLatest('changeEditorText', checkSyntax)
}
