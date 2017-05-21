/**************
*** Imports ***
**************/
const r = require('rethinkdb')

/*******************
*** User Service ***
*******************/
module.exports = (conn) => {
    return {
        createUser({username, password}) {
            return r.table('users')
                    .insert({ id: username, password: password })
                    .run(conn)
        },
        getUser(data) {
            return r.table('users')
                    .get(data.username)
                    .run(conn)
        },
        existUser(username) {
            return r.table('users')
                    .get(username)
                    .do(user => r.branch(user, true, false))
                    .run(conn)
        }

    }
}
