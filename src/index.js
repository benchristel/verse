import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './ui/store'
import './index.css'
import Grove from './ui/components/Grove'
import registerServiceWorker from './registerServiceWorker'
import './core/api'

ReactDOM.render(
  <Provider store={store}>
    <Grove />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
