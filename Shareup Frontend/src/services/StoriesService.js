import axios from 'axios';
import AuthService from './auth.services';

let authAxios = null;

const authenticate = () => {
    if(AuthService.getCurrentUser()){
        authAxios = axios.create({
            baseURL: 'http://192.168.100.2:8080/api/v1/',
            headers: {
                
                Authorization: `Bearer ${AuthService.getCurrentUser().jwt}`
            }
        })
    }else{
        authAxios = axios.create({
            baseURL: 'http://192.168.100.2:8080/api/v1/'
        })
    }
}
authenticate();

class StoriesService {
    getStories = async () => {
        authenticate();
        const result = await authAxios.get('stories/')
        return result;
    }
    getStoriesForUser = async (email) => {
        authenticate();
        const result = await authAxios.get(`stories/${email}`)
        return result;
    }

    createStories = async (userId, formdata) => {
        const result = await authAxios.post(`Stories/${userId}`,formdata)
        return result
    }
    updateStories = async (storiesId, stories) => {
        const result = await authAxios.put(`stories/${storiesId}`, stories)
        return result;
    }

    
}

export default new StoriesService();