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
            baseURL: baseurl,
        })
    }
}
authenticate();

class ReelsServices {
    
    createReels = async (userId, formdata) => {

        console.log(formdata)

        const result = await authAxios.post(`/reels/web/${userId}`,formdata)
        return result
    }



    getReelForUser = async (email) => {
        authenticate();
        const result = await authAxios.get(`reel/user/${email}`)
        return result;
    }

    getPreviewReel = async () => {
        authenticate();
        const result = await authAxios.get(`/last/reels`)
        return result;
    }

    getAllReels = async () => {
        authenticate();
        const result = await authAxios.get(`reels`)
        return result;
    }


    
}

export default new ReelsServices();