import axios from "axios";

export const getAllUsersService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'get',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/get-all-user`,
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const updateAvatar = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'put',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/set-avatar`,
                data
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleAddFriendService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'post',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/set-friend`,
                data
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleGetFriend = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'get',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/get-friend`,
                params
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const getInfoFriends = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'get',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/get-info-friends?friendsId=${payload}`,
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}