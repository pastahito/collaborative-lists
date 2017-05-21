/**************
*** IMPORTS ***
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

/**************
*** DB INIT ***
**************/
let conn, authEvents, changefeedsEvents
r.connect({
    host: 'localhost',
    port: 28015,
    db: 'CBD',
    user: 'CBDuser',
    password: 'CBDpassword'
}, (err, connection) => {
    if(err) console.error(err)
    conn = connection
    authEvents = require('./backend/events/authEvents')(conn)
    changefeedsEvents = require('./backend/events/changefeedsEvents')(conn)
})


/******************
*** HTTP SERVER ***
******************/
app.use(session)                                                // Attach session

app.use(express.static(path.join(__dirname, 'app', 'dist')))    // Static Content

app.use('*', (req, res) => {                                    // Basic Routing
    let preloadedState = {
        credential: {},
        changefeeds: { latests:[]},
        entities: {}
    }
    if (req.session.user) {
        preloadedState.credential = req.session.user
    }

    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>RethinkDB DEMO</title>
                <link href="https://fonts.googleapis.com/css?family=Dosis:300,400,500,600,700|Open+Sans+Condensed:300,700|Raleway:300,400|Open+Sans+Condensed:300|Source+Sans+Pro" rel="stylesheet">
                <link rel="stylesheet" href="css/bundle.css">
            </head>
            <body>
                <div id="app"></div>
                <script>
                  window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
                </script>
                <script src="/js/bundle.js"></script>
            </body>
        </html>
    `)
})

server.listen(port, () => {
    console.log("Magic happening on port " + port)
})

/*****************************************************************
*** WEBSOCKET COMMUNICATION LAYER BETWEEN BACKEND AND FRONTEND ***
*****************************************************************/
io.use(sharedSession(session))
io.on('connection', function (socket) {

    socket.emit('connection:status', {
      connected: conn!=undefined,
      loggedIn: socket.handshake.session.user?true:false
     })

    // Initialize your events here
    changefeedsEvents(socket)
    authEvents(socket)

})
