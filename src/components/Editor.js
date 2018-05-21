import React from 'react'
import connectProps from './connectProps'
import AceEditor from 'react-ace'
import { editorText } from '../selectors/editorText'
import storage from '../storage'
import { syntaxErrorLocations } from '../syntaxErrorLocations'
import { getLineInfo } from 'acorn'

import 'brace/mode/javascript'
import 'brace/theme/xcode'

import './Editor.css'

export default connectProps(props => {
  let text = editorText(props)
  return (
    <AceEditor
      className="Editor"
      mode="javascript"
      theme="xcode"
      focus={true}
      value={text}
      onChange={text => {props.changeEditorText(text, props.currentlyEditingFile, props)}}
      onLoad={configure}
      onBlur={save}
      name="AceEditor"
      editorProps={{$blockScrolling: true}}
      style={{width: '100%', height: '95%', top: '5%', position: 'absolute'}}
      markers={
        syntaxErrorLocations(text)
          .map(toMarker(text))
      }
    />
  )

  function save() {
    storage.storeFile(
      props.currentlyEditingFile,
      editorText(props))
  }
})

function configure(editor) {
  let session = editor.getSession()
  session.setUseWorker(false)
  session.setTabSize(2)
  session.setUseSoftTabs(true)
  session.setUseWrapMode(true)
  editor.setBehavioursEnabled(false) // disable auto-insertion of matching parens
  editor.renderer.setShowGutter(false) // hide line numbers
}

function toMarker(code) {
  return function(errorLocation) {
    let start = getLineInfo(code, firstNonspaceCharBefore(errorLocation.pos, code))
    return {
      startRow: start.line - 1,
      startCol: start.column,
      endRow: errorLocation.line,
      endCol: errorLocation.column + 1,
      className: 'syntaxError',
      type: 'background'
    }
  }
}

function firstNonspaceCharBefore(index, text) {
  for (let i = index - 1; i >= 0; i--) {
    let c = text[i]
    if (c !== ' ' && c !== '\n' && c !== '\t') return i
  }
  return 0
}
