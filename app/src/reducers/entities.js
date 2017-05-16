import update from 'immutability-helper'
import { CREATE_OPTION, UPDATE_OPTION, DELETE_OPTION, TOGGLE_OPTION,
    CREATE_GATHERER, UPDATE_GATHERER, DELETE_GATHERER } from '../actions'

function entities(state = {}, action) {
    switch (action.type) {
        case CREATE_OPTION:
            return state
        case UPDATE_OPTION:
            return state
        case DELETE_OPTION:
            return state
        case TOGGLE_OPTION:
            return state
        case CREATE_GATHERER:
            return state
        case UPDATE_GATHERER:
            return state
        case DELETE_GATHERER:
            return state
        default:
            return state
    }
}

export default entities
