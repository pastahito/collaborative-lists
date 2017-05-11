// Socket.io Library
import io from 'socket.io-client'

// Variables
const socket = io()
let already_called = false

// Init passive actions only once
export const startListeningForEvents = () => {
    if (already_called) return
    incomingEvents()
    already_called = true
}

// Passive actions
const incomingEvents = () => {
    socket.on('connection-state', state => {
        console.log(state)
    })
    socket.on('register-success', () => {
        console.log('register-success')
    })
    socket.on('register-error', error => {
        console.log('register-error', error)
    })
    socket.on('login-success', feedback => {
        console.log('login-success', feedback)
    })
    socket.on('login-error', error => {
        console.log('login-error', error)
    })
}

// Active actions
export const register = (user, password) => {
    console.log('register event emmited with:', user, password);
    socket.emit('register', user, password)
}
// Active actions
export const login = (user, password) => {
    console.log('login event emmited with:', user, password);
    socket.emit('login', user, password)
}
