import { combineReducers } from 'redux'
import authentication from './authentication.js'
import entities from './entities.js'

const reducers = combineReducers({
    authentication,
    entities
})

export default reducers
