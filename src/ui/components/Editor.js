import React from 'react'
import AceEditor from 'react-ace'
import { getLineInfo } from 'acorn'

import connectProps from './connectProps'
import { editorText } from '../selectors'
import { findEndOfToken } from '../findEndOfToken'

import 'brace/mode/javascript'
import 'brace/theme/xcode'

import './Editor.css'

export default connectProps(class extends React.Component {
  shouldComponentUpdate() {
    return !this.debounceTimeout
  }

  render() {
    let text = editorText(this.props)
    return (
      <AceEditor
        className="Editor"
        mode="javascript"
        theme="xcode"
        focus={true}
        value={text}
        onChange={text => {
          if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout)
          }
          this.debounceTimeout = setTimeout(() => {
            this.debounceTimeout = null
            this.props.changeEditorText(text, this.props.currentlyEditingFile)
          }, 1)
        }}
        onLoad={configure}
        name="AceEditor"
        editorProps={{$blockScrolling: Infinity}} // prevent stupid warning
        style={{width: '100%', height: '608px', top: '32px', position: 'absolute'}}
        markers={this.props.syntaxErrorLocations.map(toMarker(text))}
      />
    )
  }
})

function configure(editor) {
  let session = editor.getSession()
  session.setUseWorker(false)
  session.setTabSize(2)
  session.setUseSoftTabs(true)
  session.setUseWrapMode(true)
  editor.setBehavioursEnabled(true) // enable auto-insertion of matching parens
  editor.renderer.setShowGutter(false) // hide line numbers
}

function toMarker(code) {
  return function(errorLocation) {
    let start = getLineInfo(code, firstNonspaceCharBefore(errorLocation.pos, code))
    let end = getLineInfo(code, findEndOfToken(errorLocation.pos, code))
    return {
      startRow: start.line - 1,
      startCol: start.column + 1,
      endRow: end.line - 1,
      endCol: end.column,
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
