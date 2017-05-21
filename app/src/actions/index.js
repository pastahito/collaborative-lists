  /*************/
 /** ACTIONS **/
/*************/
export const LATESTS_ADD = 'LATESTS_ADD'
export const LATESTS_REMOVE = 'LATESTS_REMOVE'

export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'

export const CREATE_OPTION = 'CREATE_OPTION'
export const UPDATE_OPTION = 'UPDATE_OPTION'
export const DELETE_OPTION = 'DELETE_OPTION'
export const TOGGLE_OPTION = 'TOGGLE_OPTION'

export const CREATE_GATHERER = 'CREATE_GATHERER'
export const UPDATE_GATHERER = 'UPDATE_GATHERER'
export const DELETE_GATHERER = 'DELETE_GATHERER'

/*****************************/
/** Authentication Handlers **/
/*****************************/
export function latests_add(payload) {
    return { type: LATESTS_ADD, payload}
}
export function latests_remove(payload) {
    return { type: LATESTS_REMOVE, payload}
}

/*****************************/
/** Authentication Handlers **/
/*****************************/
export function logIn(payload) {
    return { type: LOG_IN, payload}
}
export function logOut() {
    return { type: LOG_OUT }
}

/*******************/
/** Ideas Handler **/
/*******************/
export function createIdea(gathererID, idea) {          // TODO
    return { type: CREATE_OPTION, gathererID, idea }
}
export function updateIdea(ideaID, newIdea) {           // TODO
    return { type: UPDATE_OPTION, ideaID, newIdea }
}
export function deleteIdea(ideaID) {                    // TODO
    return { type: DELETE_OPTION, ideaID }
}
export function toggleIdea(ideaID) {                    // TODO
    return { type: TOGGLE_OPTION, ideaID }
}

/***********************/
/** Gatherer Handlers **/
/***********************/
export function createGatherer(gatherer) {              // TODO
    return { type: CREATE_GATHERER, gatherer}
}
export function updateGatherer(newGatherer) {           // TODO
    return { type: UPDATE_GATHERER, newGatherer}
}
export function deleteGatherer(gathererID) {            // TODO
    return { type: DELETE_GATHERER, gathererID}
}
