// React
import React from 'react'
import {render} from 'react-dom'
import {startListeningForEvents} from './websocketActions.js'

// My app
import App from './App.jsx'
import {} from './global.css'

startListeningForEvents()

render(
    <App />,
    document.getElementById('app')
)
