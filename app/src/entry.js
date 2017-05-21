// React
import React from 'react'
import {render} from 'react-dom'

// Redux for state management
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from './reducers'

// Communication layer
import {startListeningForEvents} from './websocketActions.js'

// My app
import App from './components/App.jsx'
import {} from './global.css'

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__
// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__

// Create Redux store (model) with initial state which components will retrieve data from
const store = createStore(reducers, preloadedState)

// Initialize subscriptions that dispatch store's actions
startListeningForEvents(store.dispatch)

// Render React App
render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
)
