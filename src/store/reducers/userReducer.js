import { actionTypes } from "../actions/actionTypes"
const initState = {
    allDataUser: null,
    allFriend: null,
    msg: null,
    status: false
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_USERS_SUCCESS:
            return {
                ...state,
                allDataUser: action.data.user,
                msg: action.data.msg
            }
        case actionTypes.GET_ALL_USERS_FAIL:
            return {
                ...state,
                msg: action.data.msg
            }
        case actionTypes.GET_ALL_FRIEND_SUCCESS:
            return {
                ...state,
                allFriend: action.data.response
            }
        case actionTypes.GET_ALL_FRIEND_FAIL:
            return {
                ...state,
                allFriend: null
            }
        default:
            return state
    }
}

export default userReducer