/**************
*** Imports ***
**************/
const express = require('express'),                             // Webapp
    path = require('path'),
    app = express(),
    port = process.env.PORT || 3000,
    server = require('http').Server(app),                       // Websockets
    io = require('socket.io')(server),
    r = require('rethinkdb'),                                   // Database
    sharedSession = require("express-socket.io-session"),       // Sessions
    session = require("express-session")({
        secret: "my-cat-is-cute",
        resave: true,
        saveUninitialized: true
    })


/******************
*** HTTP Server ***
******************/
app.use(session)                                                // Attach session

app.use(express.static(path.join(__dirname, 'app', 'dist')))    // Static Content

app.use('*', (req, res) => {                                    // Basic Routing
    console.log('\n== Express Session ==')
    console.log(req.sessionID)
    res.sendFile(path.join(__dirname, 'app', 'dist', 'base.html'))
})

server.listen(port, () => {                                     // Server start
    console.log("Magic happening on port " + port)
})

let conn = undefined                             // RethinkDB
r.connect({ host: 'localhost', port: 28015, db: 'CBD' }, (err, connection) => {
    if(!err) conn = connection
})

/*******************
*** User Service ***
*******************/
const createUser = ({username, password}) => {
    return r.table('users')
            .insert({ id: username, password: password })
            .run(conn)
}
const getUser = data => {
    return r.table('users')
            .get(data.username)
            .run(conn)
}
const existUser = (username) => {
    return r.table('users')
            .get(username)
            .do(user => r.branch(user, true, false))
            .run(conn)
}


/*************************************************
*** WEBSOCKET COMMUNICATION LAYER BETWEEN BACKEND AND SPA ***
*************************************************/
io.use(sharedSession(session))

io.on('connection', function (socket) {
    console.log('\n== Socket.io Session ==')
    console.log(socket.handshake.session.id)

    /* NOTIFY */
    socket.emit('connection:status', {
        connected: conn!=undefined,
    })

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
        .then( createUser )
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
        .then( getUser )
        .then ( user => {
            if(user != null) {
                socket.handshake.session.user = {username: data.username}
                socket.handshake.session.save()
                socket.emit('log-in:success', data.username)
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
        .then( existUser )
        .then( exists => {
            socket.emit('is-username-available:reply', exists)
        })
        .catch( error => {
            socket.emit(error.event?error.event:'connection:error', error.msg)
        })
    })
})
