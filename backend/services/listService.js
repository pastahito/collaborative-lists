/**************
*** Imports ***
**************/
const r = require('rethinkdb')

/*******************
*** User Service ***
*******************/
module.exports = () => {
    return {
        lastestsListsFeed() {
            return r.table('lists')
                    .orderBy({index: r.desc('date')})
                    .limit(20)
                    .changes({includeInitial: true})
        }
    }
}
