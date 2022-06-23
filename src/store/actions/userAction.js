import { actionTypes } from "./actionTypes";
import * as userService from '../../services/userServices'

export const getAllUsers = (data) => {
    return async (dispatch, getState) => {
        try {
            let response = await userService.getAllUsersService()
            if (response && response.data.err === 0) {
                dispatch(getAllUsersSuccess(response.data))
            } else {
                dispatch(getAllUsersFail(response.data))
            }
        } catch (error) {
            dispatch(getAllUsersFail(error))
        }
    }
}
export const getAllUsersSuccess = (data) => ({
    type: actionTypes.GET_ALL_USERS_SUCCESS,
    data
})
export const getAllUsersFail = (data) => ({
    type: actionTypes.GET_ALL_USERS_FAIL,
    data
})
export const getAllfriend = (params) => {
    return async (dispatch, getState) => {
        try {
            let response = await userService.handleGetFriend(params)
            if (response && response.data.err === 0) {
                dispatch(getAllfriendSuccess(response.data))
            } else {
                dispatch(getAllfriendFail(response.data))
            }
        } catch (error) {
            dispatch(getAllfriendFail(error))
        }
    }
}
export const getAllfriendSuccess = (data) => ({
    type: actionTypes.GET_ALL_FRIEND_SUCCESS,
    data
})
export const getAllfriendFail = (data) => ({
    type: actionTypes.GET_ALL_FRIEND_FAIL,
    data
})