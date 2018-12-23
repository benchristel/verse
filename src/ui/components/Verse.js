import React from 'react'
import './Verse.css'
import Backdrop from './Backdrop'
import CenteredContainer from './CenteredContainer'
import { Left } from './left/Left'
import { Right } from './right/Right'

export default () => (
  <div className="Verse">
    <Backdrop>
      <CenteredContainer height="640px" width="1024px" style={{boxShadow: '-6px -6px 0 #fff, -6px 6px 0 #fff, 6px -6px 0 #fff, 6px 6px 0 #fff'}}>
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
