import React from 'react'
import connectProps from './connectProps'
import AceEditor from 'react-ace'
import { editorText } from '../selectors/editorText'
import storage from '../storage'

import 'brace/mode/javascript'
import 'brace/theme/xcode'

export default connectProps(props => {
  return (
    <AceEditor
      mode="javascript"
      theme="xcode"
      value={editorText(props)}
      onChange={props.changeEditorText}
      onBlur={save}
      name="AceEditor"
      editorProps={{$blockScrolling: true}}
      style={{width: '100%', height: '95%', top: '5%', position: 'absolute'}}
    />
  )

  function save() {
    storage.storeFile(
      props.currentlyEditingFile,
      editorText(props))
  }
})