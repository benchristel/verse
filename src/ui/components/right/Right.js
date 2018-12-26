import React from 'react'

import Pane from '../Pane'
import Tab from '../Tab'
import Hide from '../Hide'
import DustCover from './DustCover'
import Terminal from './Terminal'
import {
  anySyntaxErrors,
  getSyntaxErrors,
  anyTestFailures
} from '../../selectors'
import { get, isTruthy } from '../../../core'

import connectProps from '../connectProps'

const Right = connectProps(props => (
  <Pane style={{width: '50%', left: '50%', height: '640px'}}>
    <Pane style={{height: '32px', top: 0, backgroundColor: '#d8d2d0', zIndex: 10, padding: '4px 0 4px 13px'}}>
      <Tab
        color={loadButtonColor(props)}
        onClick={() => props.inspectStage('load')}
        className={isInspectingStage('load', props) ? 'selected' : ''}>
        Load
      </Tab>
      <Tab
        color={testButtonColor(props)}
        onClick={() => props.inspectStage('test')}
        className={isInspectingStage('test', props) ? 'selected' : ''}>
        Test
      </Tab>
      <Tab
        color={runButtonColor(props)}
        onClick={() => { props.runApp(); props.inspectStage('run') }}
        className={isInspectingStage('run', props) ? 'selected' : ''}>
        Run
      </Tab>
    </Pane>

    <Pane style={{top: '32px'}}>
      <Terminal/>

      <Hide If={!isInspectingStage('load', props)}>
        <Pane className="scroll" style={{backgroundColor: '#db6', zIndex: 20}}>
          <ErrorPanel />
        </Pane>
      </Hide>

      <Hide If={!isInspectingStage('test', props)}>
        <Pane className="scroll" style={{backgroundColor: '#022', zIndex: 20}}>
          <TestResultsPanel />
        </Pane>
      </Hide>

      <Hide If={!isInspectingStage('run', props) || !props.crash}>
        <Pane className="scroll" style={{backgroundColor: '#000', color: '#fff', zIndex: 20}}>
          <CrashPanel />
        </Pane>
      </Hide>
    </Pane>
    <DustCover/>
  </Pane>
))

function loadButtonColor(state) {
  return anySyntaxErrors(state) ? '#b90' : '#099'
}

function testButtonColor(state) {
  return anyTestFailures(state) ? '#920' : '#099'
}

function runButtonColor(state) {
  return state.crash ? '#000' : '#099'
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
  let testResults = Object.keys(props.testResults)
    .map(k => [k, props.testResults[k]])

  let failures = testResults.filter(thru(get(1), isTruthy))

  if (failures.length) {
    return (<div className="TestResultsPanel">
      {testCountString(failures.length)} found {bugCountString(failures.length)}!
      {failures.map(renderTestResult).join('\n')}
    </div>)
  } else {
    return (<div className="TestResultsPanel">
      {passedTestsString(testResults.length)}
    </div>)
  }
})

function renderTestResult([name, error]) {
  return `
-------------------------------------------------
${name}

${error}
`
}

function testCountString(count) {
  switch (count) {
    case 1:
    return 'One test'

    default:
    return '' + count + ' tests'
  }
}

function bugCountString(count) {
  switch (count) {
    case 1:
    return 'a bug'

    default:
    return 'bugs'
  }
}

function passedTestsString(count) {
  switch (count) {
    case 0:
    return 'No tests to run.'

    case 1:
    return 'One test ran, and found no issues.'

    default:
    return '' + count + ' tests ran, and found no issues.'
  }
}

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
  return ''
}

function isInspectingStage(stage, state) {
  return state.currentlyInspectingStage === stage
}

function thru(...fns) {
  return function(input) {
    return fns.reduce((v, f) => f(v), input)
  }
}

export { Right }