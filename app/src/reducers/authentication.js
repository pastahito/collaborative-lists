import { SIGN_UP, LOG_IN, LOG_OUT } from '../actions'
import update from 'immutability-helper'

const initialState = {
    username = 'guest'
}

function authentication(state = initialState, action) {
    switch (action.type) {
        case SIGN_UP:
            return state
        case LOG_IN:
            return state
        case LOG_OUT:
            return state
        default:
            return state
    }
}

export default authentication
