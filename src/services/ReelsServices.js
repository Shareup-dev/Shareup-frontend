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
        const result = await authAxios.post(`/new_reel/${userId}`,formdata)
        return result
    }

    
    deleteReel = async (reelid) => {
        const result = await authAxios.delete(`reels/${reelid}`)
        return result
    }

    getReelForUser = async (userId) => {
        authenticate();
        const result = await authAxios.get(`reels/user/${userId}`)
        return result;
    }

    getReelForUserFriends = async (userId) => {
        authenticate();
        const result = await authAxios.get(`Explore_myfriends_reels/${userId}`)
        return result;
    }

    getExploreReels = async (userId) => {
        authenticate();
        const result = await authAxios.get(`Explore_reels/${userId}`)
        return result;
    }

    getPreviewReel = async () => {
        authenticate();
        const result = await authAxios.get(`reels`)
        return result;
    }

    getAllReels = async () => {
        authenticate();
        const result = await authAxios.get(`reels`)
        return result;
    }

    likeReel = async (uid,rid,data) =>{
        authenticate();
        const result = await authAxios.put(`reels/${uid}/like-unlike/${rid}`,data)
        return result;
    }
    getCommentsForReel = async (rid) =>{
        const result = await authAxios.get(`get_reel_comments/${rid}`)
        return result;
    }
    addCommentsForReel = async (uid,rid,data) =>{
        const result = await authAxios.post(`comment_on_reel/${uid}/${rid}`,data)
        return result;
    }
}

export default new ReelsServices();