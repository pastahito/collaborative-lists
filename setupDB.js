const r = require('rethinkdb')

// DB reset
r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
    if(err) throw err

    const data_to_insert = [
        {name: "A-House of Cards", rating: 10},
        {name: "A-Sense8", rating: 9},
        {name: "A-Sherlock", rating: 8}
    ]


    r.dbList().contains('CBD')
    .do(exists => r.branch(exists, r.dbDrop('CBD'), {}))            // Drop if exists
    .do(_ => r.dbCreate('CBD'))                                     // Create DB
    .do(_ => r.db('CBD').tableCreate('polls'))                      // Create Table
    .do(_ => r.db('CBD').table('polls').insert(data_to_insert))     // Insert Documents
    .run(conn)
    .then( res => console.log(res))
    .catch(e => console.log(e.msg))

})
