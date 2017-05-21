/**************
*** Imports ***
**************/
const r = require('rethinkdb')

/*******************
*** List Service ***
*******************/
module.exports = () => {
    return {
        lastestsListsFeed() {
            return r.table('lists')
                    .orderBy({index: r.desc('date')})
                    .limit(20)
                    .changes({includeInitial: true})
        },

        removeListById(id) {
          return r.table('lists')
                  .get(id)
                  .delete()
        }
    }
}
