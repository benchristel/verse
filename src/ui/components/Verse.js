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
import stackParser from '../stackParser'
import { anySyntaxErrors, getSyntaxErrors, anyTestFailures } from '../selectors'
import { isTruthy } from '../../core'

export default () =>
  (<div className="Verse">
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
  </div>)

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
      <Pane style={{height: '32px', top: 0, backgroundColor: '#444', zIndex: 10, padding: '4px 0 4px 13px'}}>
        <Button
          color={loadButtonColor(props)}
          onClick={() => props.inspectStage('load')}
          className={isInspectingStage('load', props) ? 'selected' : ''}>
          Load
        </Button>
        <Button
          color={testButtonColor(props)}
          onClick={() => props.inspectStage('test')}
          className={isInspectingStage('test', props) ? 'selected' : ''}>
          Test
        </Button>
        <Button
          color={runButtonColor(props)}
          onClick={() => { props.runApp(); props.inspectStage('run') }}
          className={isInspectingStage('run', props) ? 'selected' : ''}>
          Run
        </Button>
      </Pane>

      <Pane style={{top: '32px'}}>
        <Terminal/>

        <Hide If={!isInspectingStage('load', props)}>
          <Pane style={{backgroundColor: '#db6', zIndex: 20, padding: '12px'}}>
            <ErrorPanel />
          </Pane>
        </Hide>

        <Hide If={!isInspectingStage('test', props)}>
          <Pane style={{backgroundColor: '#088', zIndex: 20, padding: '12px'}}>
            <TestResultsPanel />
          </Pane>
        </Hide>

        <Hide If={!isInspectingStage('run', props) || !props.crash}>
          <Pane style={{backgroundColor: '#000', color: '#fff', zIndex: 20, padding: '12px'}}>
            <CrashPanel />
          </Pane>
        </Hide>
      </Pane>
    </Pane>
  )
})

function loadButtonColor(state) {
  return anySyntaxErrors(state) ? '#db6' : '#0c9'
}

function testButtonColor(state) {
  return anyTestFailures(state) ? '#f30' : '#0c9'
}

function runButtonColor(state) {
  return state.crash ? '#000' : '#0c9'
}

const ErrorPanel = connectProps(props => {
  let syntaxErrors = getSyntaxErrors(props)

  if (syntaxErrors.length > 0) {
    return (
      <div className="ErrorPanel">{
        getSyntaxErrors(props).map(e =>
          `${e.error.toString()}\n\n`
          + renderStackInfo(e.error))
          .join('\n\n')
      }</div>
    )
  } else {
    return (
      <div className="ErrorPanel">
        All code loaded successfully.
      </div>
    )
  }
})

const TestResultsPanel = connectProps(props => {
  let testResults = props.testResults

  if (Object.values(testResults).filter(isTruthy).length) {
    return (<div className="TestResultsPanel">One or more tests failed</div>)
  } else {
    return (<div className="TestResultsPanel">All tests passed</div>)
  }
})

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

function isInspectingStage(stage, state) {
  return state.currentlyInspectingStage === stage
}

function renderLineNumber(stack) {
  let line = stackParser(stack).line
  if (line !== null) {
    return 'at line ' + line
  }
  return ''
}
