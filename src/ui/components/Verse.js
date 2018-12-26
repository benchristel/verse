import React from 'react'
import './Verse.css'
import Backdrop from './Backdrop'
import CenteredContainer from './CenteredContainer'
import { Left } from './left/Left'
import { Right } from './right/Right'
import { cssVariables } from './cssVariables'

const {
  '--content-height': contentHeight,
  '--content-width':  contentWidth,
} = cssVariables

export default () => (
  <div className="Verse" style={cssVariables}>
    <Backdrop>
      <CenteredContainer height={contentHeight} width={contentWidth} style={{boxShadow: '-6px -6px 0 #fff, -6px 6px 0 #fff, 6px -6px 0 #fff, 6px 6px 0 #fff'}}>
        <Links/>
        <Left/>
        <Right/>
      </CenteredContainer>
    </Backdrop>
  </div>
)

let Links = () => (
  <div className="links">
    Verse DEVELOPMENT VERSION |&nbsp;
    <a href="https://benchristel.github.io/verse/docs">
      Documentation
    </a>
  </div>
)
