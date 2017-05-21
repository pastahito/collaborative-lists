/*************************
*** Changefeeds Events ***
*************************/
module.exports = (conn) => (socket) => {

    // Services
    const listService = require('../services/listService')(conn)

    // Lastest Lists
    socket.on('latests', _ => {
        listService.lastestsListsFeed().run(conn)
        .then(cursor => {
            cursor.each( (err, row) => {
                if (err) console.error(err)
                socket.emit('latests:changefeed', row)
            })
        })
        .catch( error => {
            socket.emit(error.event?error.event:'connection:error', error.msg)
        })
    })


    socket.on('removeListById', id => {
      listService.removeListById(id).run(conn)
      .then(data => {
        console.log(data);
      })
      .catch( error => {
          socket.emit(error.event?error.event:'connection:error', error.msg)
      })
    })
}
