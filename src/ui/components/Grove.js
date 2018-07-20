import React from 'react'
import './Grove.css'
import connectProps from './connectProps'
import Backdrop from './Backdrop'
import CenteredContainer from './CenteredContainer'
import Button from './Button'
import Editor from './Editor'
import Hide from './Hide'
import Pane from './Pane'
import Terminal from './Terminal'
import storage from '../storage'
import stackParser from '../stackParser'
import { anySyntaxErrors, getSyntaxErrors } from '../selectors'

export default connectProps(class extends React.Component {
  componentWillMount() {
    storage.onLoad(files =>
      this.props.loadFiles(files, this.props))
  }

  render() {
    return (
      <div className="Grove">
        <Backdrop>
          <CenteredContainer height="650px" width="1034px">
            <Links/>
            <LeftPane/>
            <RightPane/>
          </CenteredContainer>
        </Backdrop>
      </div>
    )
  }
})

let Links = () => {
  return (
    <div className="links">
      <a href="https://benchristel.github.io/verse">
        Read the Docs
      </a> |&nbsp;
      <a href="https://facebook.com/VerseCode">
        Get help on Facebook
      </a> |
      By using Verse you agree to the&nbsp;
      <a href="https://benchristel.github.io/verse/tos">
        Terms of Service
      </a>
    </div>
  )
}

let LeftPane = connectProps(props => {
  return (
    <Pane style={{width: '50%'}}>
      <EditorHeaderBar/>
      <Editor/>
    </Pane>
  )
})

const RightPane = connectProps(props => {
  return (
    <Pane style={{width: '50%', left: '50%', backgroundColor: '#020'}}>
      <Pane style={{top: '32px'}}>
        <Terminal/>
      </Pane>
      <Pane style={{height: '32px', top: 0, backgroundColor: '#888', zIndex: 10, padding: '4px 6px'}}>
        <Button onClick={props.runApp}>Run</Button>
      </Pane>
      <Hide If={!props.isErrorPanelShown || !anySyntaxErrors(props)}>
        <Pane style={{backgroundColor: '#db6', zIndex: 30, padding: '12px'}}>
          <ErrorPanel />
        </Pane>
      </Hide>
      <Hide If={!props.crash}>
        <Pane style={{top: '32px', backgroundColor: '#000', color: '#fff', zIndex: 20, padding: '12px'}}>
          <CrashPanel />
        </Pane>
      </Hide>
    </Pane>
  )
})

const EditorHeaderBar = connectProps(props => {
  return (
    <div className="EditorHeaderBar" style={props.style}>
      <div className="filename">
      </div>
      <StatusBadge
        onClick={() => props.showErrorPanel()}
        style={{position: 'absolute', top: '4px', right: '6px'}}/>
    </div>
  )
})

const StatusBadge = connectProps(props => {
  let message = 'OK'
  let className = 'StatusBadge'
  if (anySyntaxErrors(props)) {
    message = "Can't run"
    className += ' error'
  }
  return (
    <div
      onClick={props.onClick}
      className={className}
      style={props.style}>
      {message}
    </div>
  )
})

const ErrorPanel = connectProps(props => (
  <div className="ErrorPanel">{
    getSyntaxErrors(props).map(e =>
      `${e.error.toString()}\n\n`
      + renderStackInfo(e.error))
      .join('\n\n')
  }</div>
))

const CrashPanel = connectProps(props => (
  <div className="ErrorPanel">{
    props.crash ? (
      'Crashed! The error was:\n\n'
      + props.crash.message
      + '\n\n'
      + renderStackInfo(props.crash)
    ) : ''

  }</div>
))

function renderStackInfo(error) {
  if (error.verseStack) {
    return 'at function ' +
      error.verseStack.join('()\n  called from ')
      + '()'
  }
  return renderLineNumber(error.stack)
}

function renderLineNumber(stack) {
  let line = stackParser(stack).line
  if (line !== null) {
    return 'at line ' + line
  }
  return ''
}
