import AuthService from "./auth.services";
import axios from "axios";
import settings from "./Settings";


const baseURL = `${settings.apiUrl}/api/v1/`;
let authAxios = null;

const authenticate = async () => {
  await AuthService.getCurrentUser().then(
    (res) => {
      // console.log(res.jwt + "  jwt recieved in authenticate")
      authAxios = axios.create({
        baseURL: baseURL,
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
  //     console.log(AuthService.getCurrentUser() + " heheheh")
  //      authAxios = axios.create({
  //         baseURL: `${my_api}/api/v1/`,
  //         headers: {
  //             'Authorization': `Bearer ${AuthService.getCurrentUser().jwt}`,
  //             'Access-Control-Allow-Origin': "*",
  //         }
  //     })
  //     console.log("successfully got user? " + authAxios)
  // }else{
  //     authAxios = axios.create({
  //         baseURL: `${my_api}/api/v1/`
  //     })
  // }
  // console.log("ending authenticate")
};
authenticate();

class UserService {
  getUsers = async () => {
    const result = await authAxios.get("users/");
    return result;
  };

  createUser = async (user) => {
    const result = await axios.post(`${baseURL}users/`, user);
    return result;
  };

  editProfile = async (email, user) => {
    const result = await authAxios.put(`users/${email}/edit_profile`, user);
    return result;
  };

  // handleLogin = async (user) => {
  //     const result = await authAxios.post
  //     return axios.post(USER_API_BASE_URL+'/authenticate', user , {withCredentials: true})
  // }

  getUserByEmail = async (email) => {
    // console.log("data got here? " + email)
    authenticate();
    const result = await authAxios.get("users/email/" + email);
    // console.log('users/email/' + email)
    return result;
  };

  // addFriends = asyny (uid, fid) => {

  // }

  getFriends = async (email) => {
    const result = await authAxios.get("/friends/" + email);
    return result;
  };

  getFollowers = async (email) => {
    const result = await authAxios.get(`${email}/followers`);
    return result;
  };

  getFollowing = async (email) => {
    const result = await authAxios.get(`${email}/following`);
    return result;
  };

  getFriendRequestSent = async (email) => {
    const result = await authAxios.get(`${email}/friend_request_sent`);
    return result;
  };

  getFriendRequestRecieved = async (email) => {
    const result = await authAxios.get(`${email}/friend_request_recieved`);
    return result;
  };

  follow = async (email, followed_id) => {
    const result = await authAxios.post(`${email}/follows/${followed_id}`);
    return result;
  };

  unfollow = async (email, followed_id) => {
    const result = await authAxios.delete(`${email}/unfollow/${followed_id}`);
    return result;
  };

  uploadProfilePicture = async (email, formdata) => {
    const result = await authAxios.post(
      `users/${email}/upload_profile_picture`,
      formdata
    );
    return result;
  };

  uploadCoverPicture = async (email, formdata) => {
    const result = await authAxios.post(
      `users/${email}/upload_cover_picture`,
      formdata
    );
    return result;
  };

  likePost = async (uid, pid) => {
    const result = await authAxios.put(`/posts/${uid}/like-unlike/${pid}`, {
      emoji: "like",
    });
    return result;
  };

  savePost = async (uid, pid) => {
    const result = await authAxios.put(`/posts/${uid}/save-unsave/${pid}`);
    return result;
  };
}

export default new UserService();
