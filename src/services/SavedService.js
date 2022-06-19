import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";

const USER_API_BASE_URL =  `${settings.apiUrl}/api/v1/`
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
            baseURL: USER_API_BASE_URL
        })
    }
}
authenticate();

class SavedService {
    saveAllPosts = async (uid,postid) => {
        const result = await authAxios.put(`allposts/${uid}/save-unsave/${postid}`)
        return result;
    }
    getSavedReels = async (uid) => {
        const result = await authAxios.get(`${uid}/getSavedReels`)
        return result;
    }
}
export default new SavedService();