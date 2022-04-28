import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";

const USER_API_BASE_URL = `${settings.apiUrl}/api/v1/`
let authAxios = null;

const authenticate = () => {
    if(AuthService.getCurrentUser()){
        authAxios = axios.create({
            baseURL: USER_API_BASE_URL,
            headers: {
                'Authorization': `Bearer ${AuthService.getCurrentUser().jwt}`,
                'Access-Control-Allow-Origin': "*"
            }
        })
    }else{
        authAxios = axios.create({
            baseURL:  `${settings.apiUrl}/api/v1/`
        })
    }
}
authenticate()

class FriendService {
    getFriends = async (email) => {
        authenticate()
        const result = await authAxios.get('/friends/email/' + email)
        return result
    }


    getFriendStatus = async (uid, fid) => {
        const result = await authAxios.get(`/${uid}/friend_with/${fid}`)
        return result
    }

    getFriendCount = async (uid) => {
        const result = await authAxios.get(`/users/${uid}/get_counters`)
        return result
    }

    addFriends = async (uid, fid) => {
        const result = await authAxios.post(`/friends/${uid}/${fid}`)
        return result
    }

    removeFriends = async (uid, fid) => {
        const result = await authAxios.delete(`/friends/${uid}/${fid}`)
        return result
    }

    sendRequest = async (uid,fid) => {
        const result = await authAxios.post(`/${uid}/friend_request/${fid}`)
        return result
    }

    acceptRequest = async (uid, fid) => {
        const result = await authAxios.post(`/${uid}/accept_friend_request/${fid}`)
        return result
    }

    declineRequest = async (uid, fid) => {
        const result = await authAxios.post(`/${uid}/decline_friend_request/${fid}`)
        return result
    }

    unsendRequest = async (uid, fid) => {
        const result = await authAxios.post(`/${uid}/decline_friend_request/${fid}`)
        return result
    }
}

export default new FriendService();