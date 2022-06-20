import { actionTypes } from '../actions/actionTypes'

const initState = {
    statusRefresh: false,
    socket: null
}

const appReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.REFRESH:
            return {
                ...state,
                statusRefresh: !state.statusRefresh
            }
        case actionTypes.START_SOCKET:
            return {
                ...state,
                socket: action.data
            }
        default:
            return state
    }
}

export default appReducer