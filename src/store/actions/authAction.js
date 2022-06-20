import { actionTypes } from "./actionTypes";

export const loginSuccess = (data) => ({
    type: actionTypes.LOGIN_SUCCESS,
    data
})
export const logout = () => ({
    type: actionTypes.LOGOUT,
})