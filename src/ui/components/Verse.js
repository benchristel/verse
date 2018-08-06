import React from 'react'
import './Verse.css'
import connectProps from './connectProps'
import Backdrop from './Backdrop'
import CenteredContainer from './CenteredContainer'
import Frame from './Frame'
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
      <div className="Verse">
        <Backdrop>
          <CenteredContainer height="654px" width="1038px">
            <Links/>
            <Frame>
              <div style={{position: 'absolute', height: '640px', border: '1px solid #a42', width: '1024px'}}>
                <LeftPane/>
                <RightPane/>
              </div>
            </Frame>
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
    <Pane style={{width: '512px'}}>
      <Editor/>
    </Pane>
  )
})

const RightPane = connectProps(props => {
  return (
    <Pane style={{width: '512px', left: '512px', backgroundColor: '#020', height: '100%'}}>
      <Terminal/>
      <Pane style={{height: '32px', top: 0, backgroundColor: '#444', zIndex: 10, padding: '4px 6px'}}>
        <Button color={loadButtonColor(props)} onClick={props.showErrorPanel}>
          Load
        </Button>
        <Button color={'#aaa'} onClick={props.runApp}>
          Test
        </Button>
        <Button color={runButtonColor(props)} onClick={props.runApp}>
          Run
        </Button>
      </Pane>
      <Hide If={!props.isErrorPanelShown || !anySyntaxErrors(props)}>
        <Pane style={{backgroundColor: '#db6', zIndex: 30, padding: '12px', top: '32px'}}>
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

function loadButtonColor(state) {
  return anySyntaxErrors(state) ? '#db6' : '#0c9'
}

function runButtonColor(state) {
  return state.crash ? '#000' : '#0c9'
}

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
