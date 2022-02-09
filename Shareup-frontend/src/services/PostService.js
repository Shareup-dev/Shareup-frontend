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

    getSavedPostForUser = async (email) => {
        authenticate();
        const result = await authAxios.get(`posts/${email}/saved_posts`)
        return result;
    }

    createPost = async (userId, formdata, userTagId) => {
        const result = await authAxios.post(`posts/${userId}`,formdata, { params: { userTagId }}
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

    deleteComment = async (commentid) => {
        const result = await authAxios.delete(`comment/${commentid}`)
        return result
    }
    updateuserPassword = async(email,ConPass,password)=>{
        console.log("This is conpass " +ConPass)
        console.log(password)
       const result = await authAxios.put(`/users/${email}/change_password/${ConPass}`,password)
        // console.log("Pass updated "+password);
       return result
     }
     CheckOldPass = async (email,conpass) => {
        authenticate();
        // console.log(pass)
        const result = await authAxios.get(`/users/${email}/${conpass}`)
        return result;
        // console.log(result)
    }

}

export default new PostService();