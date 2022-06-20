import { actionTypes } from "../actions/actionTypes"
const initState = {
    isLoggedIn: false,
    user: null
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: action.data
            }
        case actionTypes.LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null
            }
        default:
            return state
    }
}

export default authReducer