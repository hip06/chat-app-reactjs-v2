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
export const updateStatusFriend = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'put',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/update-status-friends`,
                data
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const getRoomId = ({ userId, friendId }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'get',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/get-conversation-id?userId=${userId}&friendId=${friendId}`,
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const sendMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'put',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/update-chat`,
                data
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const getPastChat = (conversationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'get',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/past-chat?conversationId=${conversationId}`,
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const createNoticeOffline = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'post',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/create-notice-offine`,
                data
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const getNoticeOffline = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'get',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/get-notice-offine?receiver=${userId}`,
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const deleteNoticeOffline = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'delete',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/delete-notice-offine?userId=${userId}`,
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}