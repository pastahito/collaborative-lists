// Socket.io Library
import io from 'socket.io-client'
const socket = io('//' + window.location.host)

// Store's actions
import { logIn as logInRedux, logOut as logOutRedux, latests_add, latests_remove } from './actions'

// Init passive actions only once
let already_called = false
export const startListeningForEvents = (dispatch) => {
    if (already_called) return
    incomingEvents(dispatch)
    already_called = true
}

// Passive actions
const incomingEvents = (dispatch) => {
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
    socket.on('log-in:success', payload => {
        console.log('log-in:success', payload)
        dispatch(logInRedux(payload))
        socket.emit('latests')
    })

    socket.on('latests:changefeed', row => {
        console.log('latests:changefeed', row)
        if(row.new_val!=undefined && row.new_val!=null){
            dispatch(latests_add(row.new_val))
        }
        if(row.old_val!=undefined && row.old_val!=null){
            dispatch(latests_remove(row.old_val))
        }
    })

    socket.on('log-in:error', error => {
        console.log('log-in:error', error)
    })
    socket.on('log-out:success', () => {
        console.log('log-out:success')
        dispatch(logOutRedux())
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
