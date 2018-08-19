import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './ui/store'
import './index.css'
import Verse from './ui/components/Verse'
import registerServiceWorker from './registerServiceWorker'
import './core/api'

import { exportStandaloneApp } from './ui/exportStandaloneApp'
window.exportStandaloneApp = exportStandaloneApp

ReactDOM.render(
  <Provider store={store}>
    <Verse />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
