import HttpClient from './HttpClient'
import constant from './constant'

const { auth } = constant
const user = JSON.parse(localStorage.getItem('user') || '{}')

export default {

    authLogin(payload: {username: string, password: string}) {
        return HttpClient.post(`${auth}/login`, payload)
    },

    authVerify() {
        return HttpClient.get(`${auth}/verify`, {
            headers: {
                Authorization:`Bearer ${user.token}`,
            }
        })
    },

    authCheckAccount(payload: {username: string}) {
        return HttpClient.post(`${auth}/check-account`, payload)
    },
}