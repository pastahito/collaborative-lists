/*
This login system approach is been dropped within this commit
due to my missunderstanding about RethinkDB's accounts:
    A user in RethinkDB is similar to users in most other database systems;
    a database administrator may have a user account,
    and client applications may be given user accounts.
    These are unrelated to user accounts that may be implemented within the application.
    - https://www.rethinkdb.com/docs/permissions-and-accounts/
*/


const express = require('express'),                     // Webapp
    app = express(),
    port = process.env.PORT || 3000

const server = require('http').Server(app),             // Websockets
    io = require('socket.io')(server)

const r = require('rethinkdb')                          // Database

/******************
*** HTTP Server ***
******************/
app.use('/', express.static(__dirname + '/app/dist'))   // Static Content

app.get('/', (req, res) => res.sendFile('index.html') ) // Basic Routing

server.listen(port, () => {                             // Server start
    console.log("Magic happening on port " + port)
})

let defaultRethinkDBConnection = undefined
r.connect({ host: 'localhost', port: 28015 }, function(err, connection) {
    console.log(connection.rawSocket.user);
    console.log(connection.rawSocket.password);
    if(!err) defaultRethinkDBConnection = connection
})

/************************
*** RethinkDB Service ***
************************/
const register = (user, password, connection) => {
    return new Promise( (resolve, reject) => {

        const query1 = r.db('rethinkdb').table('users').insert({
            id: user,
            password: {password: password, iterations: 1024}
        })
        const query2 = r.db("CBD").grant(user, { read: true, write:true })

        query1.do( feedback =>
            r.branch(feedback('errors').eq(0), query2, {insert_error: true})
        )
        .run(connection)
        .then( res => {
            if (res.insert_error) throw {msg: 'User already exists'}
            resolve()
        })
        .catch(error => reject(error.msg))

    })
}

const login = (user, password, connection) => {
    return r.connect({host: 'localhost', port: 28015, db: 'CBD',
        user: user,
        password: password
    })
}

const logout = (connection) => {
    return connection.close({noreplyWait: false})
}


/*************************************************
*** WEBSOCKET COMMUNICATION LAYER BETWEEN BACKEND AND SPA ***
*************************************************/
let total_users = 0
io.on('disconnecting', socket => {
    total_users-=1
    socket.emit('connection-state', {
        total_users
    })
})
io.on('connection', function (socket) {
    total_users++
    let rethinkConnection = defaultRethinkDBConnection

    /* NOTIFY */
    socket.emit('connection-state', {
        connected: rethinkConnection!=undefined,
        user: rethinkConnection.rawSocket.user,
        password: rethinkConnection.rawSocket.password,
        total_users
    })

    /* REGISTER */
    socket.on('register', (user, password) => {
        register(user, password, rethinkConnection)
        .then ( () => {
            socket.emit('register-success', {})
        })
        .catch( error => {
            console.log(error)
            socket.emit('register-error', { error })
        })
    })

    /* LOGIN */
    socket.on('login', (user, password) => {
        login(user, password)
        .then ( conn => {
            rethinkConnection = conn
            socket.emit('login-success', {
                connected: rethinkConnection!=undefined,
                user: rethinkConnection.rawSocket.user,
                password: rethinkConnection.rawSocket.password
            })
        })
        .catch( error => {
            socket.emit('login-error', { error })
        })
    })

    /* LOGOUT */
    socket.on('logout', () => {
        logout(rethinkConnection)
        .then ( () => {
            rethinkConnection = defaultRethinkDBConnection
            socket.emit('logout-success', {})
        })
        .catch( error => {
            socket.emit('logout-error', { error })
        })
    })

})
