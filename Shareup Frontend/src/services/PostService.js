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
        const result = await authAxios.get(`posts/${email}`)
        return result;
    }

    getSavedPostForUser = async (email) => {
        authenticate();
        const result = await authAxios.get(`posts/${email}/saved_posts`)
        return result;
    }

    createPost = async (userId, formdata, userTagId) => {
        const result = await authAxios.post(`posts/${userId}`,formdata, { params: { userTagId }})
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
}

export default new PostService();