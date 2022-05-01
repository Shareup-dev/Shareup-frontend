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

class SearchService {
    getSearchbyuser = async (keyword) => {
        authenticate();
        const result = await authAxios.get(`/search/user?keyword=${keyword}`)
        return result;
    }


    getSearchbyPost = async (keyword) => {
        authenticate();
        const result = await authAxios.get(`/search/post?keyword=${keyword}`)
        return result;
    }

    getSearchbyGroup = async (keyword) => {
        authenticate();
        const result = await authAxios.get(`/search/group?keyword=${keyword}`)
        return result;
    }
 
        
}

export default new SearchService();