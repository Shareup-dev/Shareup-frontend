import axios from 'axios';
import AuthService from './auth.services';

const USER_API_BASE_URL = 'http://192.168.100.239:8080/api/v1/users'
const servers_api = 'http://192.168.100.2:8080'
const my_api = 'http://192.168.100.2:8080'
let authAxios = null;

const authenticate = () => {
    if(AuthService.getCurrentUser()){
        authAxios = axios.create({
            baseURL: `${my_api}/api/v1/`,
            headers: {
                'Authorization': `Bearer ${AuthService.getCurrentUser().jwt}`,
                'Access-Control-Allow-Origin': "*"
            }
        })
    }else{
        authAxios = axios.create({
            baseURL: `${my_api}/api/v1/`
        })
    }
}
authenticate();

class UserService {
    getUsers = async () => {
        const result = await authAxios.get('users/')
        return result;
    }

    createUser = async (user) => {
        const result = await axios.post('http://192.168.100.2:8080/api/v1/users/', user)
        return result;
    }

    editProfile = async (email, user) => {
        const result = await authAxios.put(`users/${email}/edit_profile`,user)
        return result
    }

    // handleLogin = async (user) => {
    //     const result = await authAxios.post
    //     return axios.post(USER_API_BASE_URL+'/authenticate', user , {withCredentials: true})
    // }

    getUserByEmail = async (email) => {
        authenticate();
        const result = await authAxios.get('users/email/' + email)
        return result;
    }

    // addFriends = asyny (uid, fid) => {

    // }

    getFriends = async (email) => {
        const result = await authAxios.get('/friends/' + email)
        return result
    }

    getFollowers = async (email) => {
        const result = await authAxios.get(`${email}/followers`)
        return result
    }

    getFollowing = async (email) => {
        const result = await authAxios.get(`${email}/following`)
        return result
    }

    getFriendRequestSent = async (email) => {
        const result = await authAxios.get(`${email}/friend_request_sent`)
        return result
    }

    getFriendRequestRecieved = async (email) => {
        const result = await authAxios.get(`${email}/friend_request_recieved`)
        return result
    }

    follow = async (email,followed_id) => {
        const result = await authAxios.post(`${email}/follows/${followed_id}`)
        return result
    }

    unfollow = async (email,followed_id) => {
        const result = await authAxios.delete(`${email}/unfollow/${followed_id}`)
        return result
    }

    uploadProfilePicture = async (email, formdata) => {
        const result = await authAxios.post(`users/${email}/upload_profile_picture`,formdata)
        return result
    }

    uploadCoverPicture = async (email, formdata) => {
        const result = await authAxios.post(`users/${email}/upload_cover_picture`,formdata)
        return result
    }

    likePost = async (uid,pid) => {
        const result = await authAxios.put(`/posts/${uid}/like-unlike/${pid}`,{emoji:"like"})
        return result
    }

    savePost = async (uid,pid) => {
        const result = await authAxios.put(`/posts/${uid}/save-unsave/${pid}`)
        return result
    }
    likeSwap = async (uid,sid) => {
        const result = await authAxios.put(`/swaps/${uid}/like-unlike/${sid}`,{emoji:"like"})
        return result
    }

    // saveSwap = async (uid,sid) => {
    //     const result = await authAxios.put(`/swaps/${uid}/save-unsave/${sid}`)
    //     return result
    // }
    
}

export default new UserService();