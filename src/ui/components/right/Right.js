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
import { cssVariables } from '../cssVariables'

import connectProps from '../connectProps'

const {
  '--content-height': contentHeight,
  '--basic-gray': basicGray,
  '--pooh': pooh,
  '--scrubs': scrubs,
} = cssVariables

const Right = connectProps(props => (
  <Pane style={{width: '50%', left: '50%', height: contentHeight}}>
    <Pane style={{height: '32px', top: 0, backgroundColor: basicGray, zIndex: 10, padding: '4px 0 4px 13px'}}>
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
        <Pane className="scroll" style={{backgroundColor: pooh, zIndex: 20}}>
          <ErrorPanel />
        </Pane>
      </Hide>

      <Hide If={!isInspectingStage('test', props)}>
        <Pane className="scroll" style={{zIndex: 20}}>
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
  return anySyntaxErrors(state) ? '#b90' : scrubs
}

function testButtonColor(state) {
  return anyTestFailures(state) ? '#920' : scrubs
}

function runButtonColor(state) {
  return state.crash ? '#000' : scrubs
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

  let [className, errorMessage] =
    anySyntaxErrors(props) ?
      ["syntax-error", "Failed to load the latest code, probably due to a syntax error. The last test result was:\n\n"]
    : ["", ""]
  className += " TestResultsPanel"

  const failures = testResults.filter(thru(get(1), isTruthy))
  const results =
    failures.length ?
      <React.Fragment>
        {testCountString(failures.length)} found {bugCountString(failures.length)}!
        {failures.map(renderTestResult).join('\n')}
      </React.Fragment>

    : <React.Fragment>
        {passedTestsString(testResults.length)}
      </React.Fragment>

  return (<div className={className}>
    {errorMessage}
    {results}
  </div>)
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
