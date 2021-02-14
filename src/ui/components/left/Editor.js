import React from 'react'
import AceEditor from 'react-ace'
import { getLineInfo } from 'acorn'

import connectProps from '../connectProps'
import { editorText } from '../../selectors'
import { findEndOfToken } from './findEndOfToken'
import { cssVariables } from '../cssVariables'

import './javascriptEditorMode'
import 'brace/theme/xcode'

import './Editor.css'

const {
  '--content-height': contentHeight
} = cssVariables

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
        style={{width: '100%', height: contentHeight, position: 'absolute'}}
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
  // enable auto-insertion of matching parens
  editor.setBehavioursEnabled(true)
  // hide line numbers
  editor.renderer.setShowGutter(false)
  // allow Cmd+L to focus the URL bar
  editor.commands.removeCommand('gotoline')

  // rebind Ctrl/Cmd-Backspace to delete line
  editor.commands.removeCommand('removewordleft')
  editor.commands.addCommand({
    name: 'removeline',
    bindKey: {mac: 'Cmd-Backspace', win: 'Ctrl-Backspace'},
    multiSelectAction: "forEach",
    exec(editor) {
      editor.removeLines()
    }
  })

  editor.commands.addCommand({
    name: 'selectMoreAfter',
    bindKey: {mac: 'Ctrl-G', win: 'Ctrl-G'},
    exec(editor) {
      editor.selectMore(1, false)
    }
  })

  editor.commands.addCommand({
    name: 'selectNextAfter',
    bindKey: {mac: 'Ctrl-Shift-G', win: 'Ctrl-Shift-G'},
    exec(editor) {
      editor.selectMore(-1, true)
    }
  })
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
