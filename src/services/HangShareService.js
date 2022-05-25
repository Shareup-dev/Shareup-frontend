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

class HangShareService {

    getAllHangShare = async () => {
        authenticate();
        const result = await authAxios.get('hangshare')
        return result;
    }

    getHangShareMeals = async () => {
        authenticate();
        const result = await authAxios.get('hangshare/Meals')
        return result;
    }

    getHangShareGifts = async () => {
        authenticate();
        const result = await authAxios.get('hangshare/Gifts')
        return result;
    }


    createHangShare = async (userId, formdata) => {
        const result = await authAxios.post(`hangshare/new_hangshare/${userId}`,formdata)
        return result
    }

    acceptHangShare = async (hsid, uId, formdata) => {
        const result = await authAxios.put(`hangshare/accept/${hsid}/${uId}`,formdata)
        return result;
    }

    editHangShare = async (uId, hsid, formdata) => {
        const result = await authAxios.put(`hangshare/${uId}/edit/${hsid}/`,formdata)
        return result;
    }

    deletePost = async (postid) => {
        const result = await authAxios.delete(`posts/${postid}`)
        return result
    }



}

export default new HangShareService();