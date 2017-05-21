const r = require('rethinkdb')
const dataset = require('./mockup/dataset.json')

// DB reset
r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
    if(err) throw err

    // Creates New RethinkDB's user
    r.db('rethinkdb')
    .table('users')
    .insert(
        { id: 'CBDuser', password: 'CBDpassword' }
    )
    .do(inserted =>
        r.db('CBD')
        .grant(
            'CBDuser',
            { read: true, write: true, config: false }
        )
    )
    .run(conn)
    .then(_ => {})
    .catch(e => console.log(e.msg))

    // Drop the whole DB and repopulates
    r.dbList().contains('CBD')
    .do(exists => r.branch(exists, r.dbDrop('CBD'), {}))            // Drop if exists
    .do(_ => r.dbCreate('CBD'))                                     // Create DB
    .do(_ => r.db('CBD').tableCreate('users'))                      // Create Table
    .do(_ => r.db('CBD').tableCreate('lists'))                      // Create Table
    .do(_ => r.db('CBD').tableCreate('items'))                      // Create Table
    .do(_ => r.db('CBD').table('lists').indexCreate('date'))
    .do(_ => r.db('rethinkdb').table('users').insert({ id: 'CBDuser', password: 'CBDpassword' }))
    .do(_ => r.db('CBD').grant('CBDuser',{ read: true, write: true, config: false }))
    .run(conn)
    .then(_ => {
        dataset.forEach( user => {
            const temp = Object.assign({}, user)
            delete temp.lists
            r.db('CBD').table('users').insert(temp).run(conn)
            .then(_ => {
                user.lists.forEach( list => {
                    const temp = Object.assign({}, list)
                    delete temp.items
                    r.db('CBD').table('lists').insert(Object.assign({author_id: user.id}, temp)).run(conn)
                    .then(result => {
                        r.db('CBD').table('items').insert(
                            list.items.map(i => Object.assign({list_id: result.generated_keys[0]}, i))
                        ).run(conn)
                    })
                })
            })
        })
    })
    .finally(_ => console.log('You can close this now'))
    .catch(e => console.log(e.msg))

})
