import HttpClient from './HttpClient'
import constant from './constant'

const { users } = constant

//export API call for users route

export default {

    //get all users
    getAllUsers(){       
        return HttpClient.requestWithToken.get(users)
    },
    //get user by Id
    getUserById(id: number){
        return HttpClient.requestWithToken.get(`${users}/${id}`)
    },
    // create a user
    create(payload: object){
        return HttpClient.requestWithToken.post(users, payload)
    }
}