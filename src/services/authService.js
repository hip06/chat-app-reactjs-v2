import axios from "axios";

export const register = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'post',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/register`,
                data
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const login = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'post',
                url: `${process.env.REACT_APP_URL_NODEJS}/api/login`,
                data
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}