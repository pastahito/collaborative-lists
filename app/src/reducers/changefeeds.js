import { LATESTS_ADD, LATESTS_REMOVE } from '../actions'
import update from 'immutability-helper'

function changefeeds(state = {}, action) {
    switch (action.type) {
        case LATESTS_ADD:
            const new_state1 = update(state, {latests: {$unshift: [action.payload]}})
            console.log(new_state1);
            return new_state1
        case LATESTS_REMOVE:
            let index = 0
            for (const el of state.latests) {
                if(el.id==action.payload.id) break
                index++
            }
            const new_state2 = update(state, {latests: {$splice: [[index, 1]]}})
            console.log(new_state2);
            return new_state2
        default:
            return state
    }
}

export default changefeeds
