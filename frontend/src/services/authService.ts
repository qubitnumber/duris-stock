import HttpClient from './HttpClient'
import constant from './constant'

const { auth } = constant

export default {

    authLogin(payload: {username: string, password: string}) {
        return HttpClient.requestWithNoToken.post(`${auth}/signin`, payload)
    },

    authLogout() {
        return HttpClient.requestWithToken.get(`${auth}/logout`)
    },


    authToken() {
        return HttpClient.requestWithToken.get(`${auth}/token`)
    },

    authRefresh() {
        return HttpClient.requestWithRefreshToken.get(`${auth}/refresh`)
    },
}