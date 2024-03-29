import { actionTypes } from '../actions/actionTypes'
import { io } from 'socket.io-client'

let socket = io(process.env.REACT_APP_SOCKET_SERVER)

const initState = {
    statusRefresh: false,
    socket
}

const appReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.REFRESH:
            return {
                ...state,
                statusRefresh: !state.statusRefresh
            }
        // case actionTypes.START_SOCKET:
        //     return {
        //         ...state,
        //         socket: action.data
        //     }
        default:
            return state
    }
}

export default appReducer