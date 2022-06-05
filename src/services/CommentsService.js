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

class CommentsService {

    editComment = async (cid , data) => {
        // authenticate();
        const result = await authAxios.put(`comment/Edit_comment/${cid}`,data)
        return result;
    }

    replyComment = async (userId, commentId,comment) => {
        const result = await authAxios.post(`comment/reply/${userId}/${commentId}`, comment)
        return result
    }
    getReplies = async (uid,commentId) => {
        const result = await authAxios.get(`comment/${uid}/get_replies/${commentId}`)
        return result
    }
    LikeReply = async (uid,rid,data) => {
        const result = await authAxios.put(`reply/${uid}/like-unlike/${rid}`,data)
        return result;
    }
    editReplyForComment = async (rid , data) => {
        // authenticate();
        const result = await authAxios.put(`reply/edit/${rid}`,data)
        return result;
    }
    deleteReply = async (rid) => {
        const result = await authAxios.delete(`reply/delete/${rid}`)
        return result
    }
    deleteComment = async (commentid) => {
        const result = await authAxios.delete(`comment/delete/${commentid}`)
        return result
    }
    LikeComment = async (uid,cid,data) => {
        authenticate();
        const result = await authAxios.put(`comment/${uid}/like-unlike/${cid}`,data)
        return result;
    }

}

export default new CommentsService();