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

class PostService {
    getPost = async () => {
        authenticate();
        const result = await authAxios.get('posts/')
        return result;
    }

    // getPostForUser = async (id) => {
    //     authenticate();
    //     const result = await authAxios.get(`posts/${id}`)
    //     return result;
    // }

    getPostForUser = async (email) => {
        authenticate();
        const result = await authAxios.get(`posts/email/${email}`)
        return result;
    }

    getPostForUserById = async (userid) => {
        authenticate();
        const result = await authAxios.get(`user/posts/${userid}`)
        return result;
    }

    getMediaForProfile = async (userid) => {
        authenticate();
        const result = await authAxios.get(`user/media/${userid}`)
        return result;
    }
    
    getCommentsForPosts = async (uid,pid) => {
        authenticate();
        const result = await authAxios.get(`comment/${uid}/get_comments/${pid}`)
        return result;
    }

    editCommentForPosts = async (cid , data) => {
        // authenticate();
        const result = await authAxios.put(`comment/Edit_comment/${cid}`,data)
        return result;
    }

    getSavedPostForUser = async (email) => {
        authenticate();
        const result = await authAxios.get(`posts/${email}/saved_posts`)
        return result;
    }

    createPost = async (userId, formdata, userTagId) => {
        const result = await authAxios.post(`new_post/${userId}`,formdata, { params: { userTagId }}
    )
        return result
    }

    updatePost = async (postId, post) => {
        const result = await authAxios.put(`posts/${postId}`, post)
        return result;
    }

    deletePost = async (postid) => {
        const result = await authAxios.delete(`posts/${postid}`)
        return result
    }

    addComment = async (userid, postid, comment) => {
        const result = await authAxios.post(`comment/${userid}/${postid}`, comment)
        return result
    }
    replyComment = async (userId, commentId,comment) => {
        const result = await authAxios.post(`comment/reply/${userId}/${commentId}`, comment)
        return result
    }
    getReplies = async (commentId) => {
        const result = await authAxios.get(`comment/get_replies/${commentId}`)
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
    
    updateuserPassword = async(email,ConPass,password)=>{
        console.log("This is conpass " +ConPass)
        console.log(password)
       const result = await authAxios.put(`/users/${email}/change_password/${ConPass}`,password)
       return result
     }
     CheckOldPass = async (email,conpass) => {
        authenticate();
        const result = await authAxios.get(`/users/${email}/${conpass}`)
        return result;
    }

}

export default new PostService();