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
      onLoad={setLinterOptions}
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

function setLinterOptions(editor) {
  let session = editor.getSession()
  console.log(session.getMode())
  if (session.$worker) {
    session.$worker.send("setOptions", [{
      curly: true,
      eqeqeq: true,
      esversion: 6,
      funcscope: false,
      futurehostile: true,
      latedef: 'nofunc',
      nocomma: true,
      notypeof: true,
      varstmt: true,
      // warning codes from https://github.com/jshint/jshint/blob/2.1.4/src/shared/messages.js
      '-W014': true, // allow operator-first style
      '-W033': true, // suppress 'Missing semicolon'

      // relaxing options
      noyield: true,
    }])
  }
}
