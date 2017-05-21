import { LOG_IN, LOG_OUT } from '../actions'
import update from 'immutability-helper'

function credential(state = {}, action) {
    switch (action.type) {
        case LOG_IN:
            return action.payload
        case LOG_OUT:
            return {}
        default:
            return state
    }
}

export default credential
