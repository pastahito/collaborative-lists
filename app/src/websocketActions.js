// Socket.io Library
import io from 'socket.io-client'

// Variables
const socket = io('//' + window.location.host)
let already_called = false

// Init passive actions only once
export const startListeningForEvents = () => {
    if (already_called) return
    incomingEvents()
    already_called = true
}

// Passive actions
const incomingEvents = () => {
    socket.on('connection:status', state => {
        console.log(state)
    })
    socket.on('connection:error', error => {
        console.log('connection:error', error)
    })
    socket.on('register:success', () => {
        console.log('register:success')
    })
    socket.on('register:error', error => {
        console.log('register:error', error)
    })
    socket.on('log-in:success', feedback => {
        console.log('log-in:success', feedback)
    })
    socket.on('log-in:error', error => {
        console.log('log-in:error', error)
    })
    socket.on('log-out:success', () => {
        console.log('log-out:success')
    })
    socket.on('credentials:error', error => {
        console.log('credentials:error', error)
    })
    socket.on('form:invalid-data', error => {
        console.log('form:invalid-data', error)
    })
    socket.on('is-username-available:reply', result => {
        console.log('is-username-available:reply', result)
    })
}

// is username available?

// Active actions
export const register = (data) => {
    console.log('register event emmited with:', data);
    socket.emit('register', data)
}
export const isUsernameAvailable = (data) => {
    console.log('isUsernameAvailable event emmited with:', data);
    socket.emit('is-username-available', data)
}
export const generalEmitter = (eventType, data) => {
    console.log(eventType+' event emmited with:', data);
    socket.emit(eventType, data)
}
// Active actions
export const logIn = (data) => {
    console.log('log in event emmited with:', data);
    socket.emit('log-in', data)
}
// Active actions
export const logOut = () => {
    console.log('log out event emmited');
    socket.emit('log-out')
}
