import React from 'react'
import connectProps from './connectProps'
import AceEditor from 'react-ace'

import 'brace/mode/javascript'
import 'brace/theme/xcode'

export default connectProps(props => {
  return (
    <AceEditor
      mode="javascript"
      theme="xcode"
      value={props.editorText}
      onChange={props.changeEditorText}
      name="AceEditor"
      editorProps={{$blockScrolling: true}}
      style={{width: '100%', height: '95%', top: '5%', position: 'absolute'}}
    />
  )
})
