import axios from "axios";
import settings from "./Settings";

const url = settings.apiUrl + '/api/v1';


const my_api = `${settings.apiUrl}/api/v1/users`;
let authAxios = null;

class AuthService {
  login = async (username, password) => {
    return await axios
      .post(my_api + "/authenticate", {
        username,
        password,
      })
      .then((response) => {
        console.log(JSON.stringify(response.data) + "This response");
        if (response.data.jwt) {
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log(
            localStorage.getItem("user") + " THIS IS THE LOCAL STORAGE"
          );
        }
        console.log(
          JSON.stringify(response.data) + " THIS BE RESPONSE DATA AUTHSERVICE"
        );
        return response;
      });
  };


  passwordResetOTP = username =>
    axios({
      method: 'PUT',
      url: `${url}/send_otp/${username}`,
    });

  verifyPasswordResetOTP = (username, otp) =>
    axios({
      method: 'GET',
      url: `${url}/verify_otp_reset_password/${username}`,
      params: {
        otp,
      },
    });

  verifyEmailOTP = username =>
    axios({
      method: 'PUT',
      url: `${url}/send_otp_verify_email/${username}`,
    });
  verifyEmailConfirmOTP = (username, otp) =>
    axios({
      method: 'GET',
      url: `${url}/verify_otp_email_verify/${username}`,
      params: {
        otp,
      },
    });

  resetPassword = (username, newPassword) =>
    axios({
      method: 'PUT',
      url: `${url}/reset_password/${username}`,
      params: {
        password: newPassword,
      },
    });
















  logout() {
    localStorage.removeItem("user");
  }

  // register(username, email, password){
  //     return axios.post()
  // }

  // const getCurrentUser = () => sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("jwtUser")) : null

  getCurrentUser = () =>
    localStorage.getItem("user") != "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : "";

  isLoggedIn = () => (this.getCurrentUser() ? true : false);

  setCurrentUser(data) {
    localStorage.setItem("user", JSON.stringify(data));
  }
}

export default new AuthService();
