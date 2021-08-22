import axios from 'axios';

const USER_API_BASE_URL = 'http://192.168.100.239:8080/api/v1/users';
const servers_api = 'http://192.168.100.2:8080/api/v1/users'
const my_api = 'http://192.168.100.2:8080/api/v1/users'
let authAxios = null;

class AuthService{
    login = async (username,password) => {
        return await axios
            .post(my_api + "/authenticate", {
                username,
                password
            })
            .then(response => {
                console.log(JSON.stringify(response.data) + "This response")
                if(response.data.jwt) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                    console.log(localStorage.getItem("user") + " THIS IS THE LOCAL STORAGE")
                }
                console.log(JSON.stringify(response.data) + " THIS BE RESPONSE DATA AUTHSERVICE")
                return response
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    // register(username, email, password){
    //     return axios.post()
    // }

    // const getCurrentUser = () => sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("jwtUser")) : null

    getCurrentUser = () => localStorage.getItem("user") != "undefined" ? JSON.parse(localStorage.getItem("user")) : ""

    isLoggedIn = () => this.getCurrentUser() ? true : false


    setCurrentUser(data){
        localStorage.setItem("user", JSON.stringify(data));
    }
}

export default new AuthService();