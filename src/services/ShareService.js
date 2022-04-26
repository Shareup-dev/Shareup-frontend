import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";

let authAxios = null;
const baseurl=`${settings.apiUrl}/api/v1/`


const authenticate = () => {
    if(AuthService.getCurrentUser()){
        authAxios = axios.create({
            baseURL: baseurl,
            headers: {
                
                Authorization: `Bearer ${AuthService.getCurrentUser().jwt}`
            }
        })
    }else{
        authAxios = axios.create({
            baseURL: baseurl
        })
    }
}
authenticate();

class ShareService {
    getShare = async () => {
        authenticate();
        const result = await authAxios.get('/share')
        return result;
    }

    // getPostForUser = async (id) => {
    //     authenticate();
    //     const result = await authAxios.get(`posts/${id}`)
    //     return result;
    // }

    getShareForUser = async (email) => {
        authenticate();
        const result = await authAxios.get(`share/email/${email}`)
        return result;
    }

    getSavedShareForUser = async (email) => {
        authenticate();
        const result = await authAxios.get(`share/${email}/saved_share`)
        return result;
    }

    createShare = async (userId,postid, formdata) => {
        const result = await authAxios.post(`share/${userId}/${postid}`,formdata)
        return result
    }

    // updateSwap = async (swapId, swap) => {
    //     const result = await authAxios.put(`swaps/${swapId}`, swap)
    //     return result;
    // }

    // deleteSwap = async (swapid) => {
    //     const result = await authAxios.delete(`swaps/${swapid}`)
    //     return result
    // }

    // addComment = async (userid, swapid, comment) => {
    //     const result = await authAxios.post(`comment/${userid}/${swapid}`, comment)
    //     return result
    // }

    // deleteComment = async (commentid) => {
    //     const result = await authAxios.delete(`comment/${commentid}`)
    //     return result
    // }
}

export default new ShareService();