import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";


const my_api = `${settings.apiUrl}`
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
        const result = await axios.post(`${my_api}/api/v1/register/`, user)
        return result;
    }

    editProfile = async (email, user) => {
        const result = await authAxios.put(`users/${email}/edit_profile`,user)
        return result
    }

    SetoptinalEmail = async (uid, optional_email) => {
        const result = await authAxios.put(`users/${uid}/contact_info/set_optional_email`,optional_email)
        return result
    }
    SendOptinalEmailOtp = async (uid) => {
        const result = await authAxios.put(`contact_info/send_otp_verify_optional_email/${uid}`)
        return result
    }
    verifyOtpOptionalEmail = async (uid,otp) => {
        const result = await authAxios.get(`contact_info/verify_otp_email_verify/${uid}`,{ params: { otp }})
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

    ChangePrimaryEmail = async (uid) => {
        const result = await authAxios.put(`users/${uid}/contact_info/make_optional_email_primary_email`)
        return result
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

    getFollowStatus = async (uid, fid) => {
        const result = await authAxios.get(`/${uid}/follow_with/${fid}`)
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

    likePost = async (uid,pid,reaction) => {
        const result = await authAxios.put(`/posts/${uid}/like-unlike/${pid}`,{emoji:reaction })
        return result
    }

    likeHangShare = async (uid,hsid) => {
        const result = await authAxios.put(`/hangshare/${uid}/like-unlike/${hsid}`,{emoji:"like"})
        return result
    }

    likeShare = async (uid,sid) => {
        const result = await authAxios.put(`/share/${uid}/like-unlike/${sid}`,{emoji:"like"})
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