/****************************
*** Authentication Events ***
****************************/
module.exports = (conn) => (socket) => {

    // Services
    const userService = require('../services/userService')(conn)

    // Helpers
    const authenticatedOnly = (data = {}) => {
        return new Promise((resolve, reject) => {
            if (!socket.handshake.session.user) {
                reject({
                    event: 'credentials:error',
                    msg: 'You have to be logged in first'
                })
            } else {
                resolve(data)
            }
        })
    }
    const unauthenticatedOnly = (data = {}) => {
        return new Promise((resolve, reject) => {
            if (socket.handshake.session.user) {
                reject({
                    event: 'credentials:error',
                    msg: 'You have to be logged off first'
                })
            } else {
                resolve(data)
            }
        })
    }
    const checkFormat = (data) => {
        return new Promise ((resolve, reject) => {
            if (data.username == '' || data.password == '') {
                reject({
                    event: 'form:invalid-data',
                    msg: 'Invalid format'
                })
            }
            resolve(data)
        })
    }

    /* REGISTER */
    socket.on('register', data => {
        unauthenticatedOnly( data )
        .then( checkFormat )
        .then( userService.createUser )
        .then( result => {
            if (result.inserted) {
                socket.emit('register:success')
            } else {
                socket.emit('register:error', 'User already exists' )
            }
        })
        .catch( error => {
            socket.emit(error.event?error.event:'connection:error', error.msg)
        })
    })

    /* LOGIN */
    socket.on('log-in', data => {
        unauthenticatedOnly( data )
        .then( checkFormat )
        .then( userService.getUser )
        .then ( user => {
            if(user != null) {
                socket.handshake.session.user = {username: data.username}
                socket.handshake.session.save()
                socket.emit('log-in:success', {username: data.username})
            } else {
                socket.emit('log-in:error', 'Invalid user/password combination')
            }
        })
        .catch( error => {
            socket.emit(error.event?error.event:'connection:error', error.msg)
        })
    })

    /* LOGOUT */
    socket.on('log-out', () => {
        authenticatedOnly()
        .then( () => {
            delete socket.handshake.session.user
            socket.handshake.session.save()
            socket.emit('log-out:success')
        })
        .catch( error => {
            socket.emit(error.event?error.event:'connection:error', error.msg)
        })
    })

    /* LOGOUT */
    socket.on('is-username-available', username => {
        unauthenticatedOnly( username )
        .then( userService.existUser )
        .then( exists => {
            socket.emit('is-username-available:reply', exists)
        })
        .catch( error => {
            socket.emit(error.event?error.event:'connection:error', error.msg)
        })
    })
}
