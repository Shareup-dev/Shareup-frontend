import axios from "axios";
import settings from "./Settings";
import AuthService from "./auth.services";

const servers_api = "http://192.168.100.2:8080";
const my_api = "http://192.168.100.239:8080";
const baseURL = `${settings.apiUrl}`;
let authAxios = null;

const authenticate = async () => {
  await AuthService.getCurrentUser().then(
    (res) => {
      // console.log(res.jwt + "  jwt recieved in authenticate")
      authAxios = axios.create({
        baseURL: `${baseURL}/api/v1/`,
        headers: {
          Authorization: `Bearer ${res.jwt}`,
          "Access-Control-Allow-Origin": "*",
        },
      });
    },
    (error) => {
      console.log(error);
    }
  );

  // if(AuthService.getCurrentUser()){
  //     authAxios = axios.create({
  //         baseURL: 'http://192.168.100.239:8080/api/v1/',
  //         headers: {

  //             Authorization: `Bearer ${AuthService.getCurrentUser().jwt}`
  //         }
  //     })
  // }else{
  //     authAxios = axios.create({
  //         baseURL: 'http://192.168.100.239:8080/api/v1/'
  //     })
  // }
};
authenticate();

class PostService {
  getPost = async () => {
    authenticate();
    const result = await authAxios.get("posts/");
    return result;
  };

  // getPostForUser = async (id) => {
  //     authenticate();
  //     const result = await authAxios.get(`posts/${id}`)
  //     return result;
  // }

  getPostForUser = async (email) => {
    authenticate();
    const result = await authAxios.get(`posts/${email}`);
    return result;
  };

  getSavedPostForUser = async (email) => {
    authenticate();
    const result = await authAxios.get(`posts/${email}/saved_posts`);
    return result;
  };

  createPost = async (userId, postContent) => {
    const formData = new FormData();
    formData.append("content", postContent.text);
    formData.append(`files`, {
      name: "postImage",
      type: "image/jpg",
      uri: postContent.image,
    });

    const result = await authAxios.post(`posts/${userId}`, formData);
    return result;
  };

  updatePost = async (postId, post) => {
    const result = await authAxios.put(`posts/${postId}`, post);
    return result;
  };

  deletePost = async (postid) => {
    const result = await authAxios.delete(`posts/${postid}`);
    return result;
  };

  addComment = async (userid, postid, comment) => {
    const result = await authAxios.post(`comment/${userid}/${postid}`, comment);
    return result;
  };

  deleteComment = async (commentid) => {
    const result = await authAxios.delete(`comment/${commentid}`);
    return result;
  };
}

export default new PostService();
