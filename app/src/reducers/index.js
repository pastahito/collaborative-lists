import { combineReducers } from 'redux'
import credential from './credential.js'
import entities from './entities.js'
import changefeeds from './changefeeds.js'

const reducers = combineReducers({
    credential,
    changefeeds,
    entities
})

export default reducers
