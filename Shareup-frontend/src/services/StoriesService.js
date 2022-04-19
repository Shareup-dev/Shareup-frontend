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
        const result = await authAxios.post(`stories/${userId}`,formdata)
        return result
    }
    updateStories = async (storiesId, stories) => {
        const result = await authAxios.put(`stories/${storiesId}`, stories)
        return result;
    }

    deleteStories = async (storiesId) => {
        const result = await authAxios.delete(`stories/${storiesId}`)
        return result;
    }

    getStoriesForUserFriends =  (userId) => authAxios.get(`stories/friends_stories/${userId}`);
    getStoriesForUserFriendsNew =  (userId) => authAxios.get(`stories/friends_stories_new/${userId}`);


    getAllStoriesViewers = async (storyid) => {
        authenticate();
        const result = await authAxios.get(`stories/views/${storyid}`)
        return result;
    }

    addViewrsToStories = async (storyid, userId) => {
        const result = await authAxios.post(`stories/get_story_add_views/${storyid}/${userId}`)
        return result
    }

    getAllStoriesViewers = async (storyid) => {
        authenticate();
        const result = await authAxios.get(`stories/views_count/${storyid}`)
        return result;
    }

}

export default new StoriesService();