import axios from 'axios';
import authHeader from '.auth-header';

const USER_API_BASE_URL = 'http://192.168.100.2:8080/api/v1/test';

class UserService {
    getPublicContent() {
        return axios.get(USER_API_BASE_URL + 'all')
    }

    getUserBoard() {
        return axios.get(USER_API_BASE_URL + 'user', {headers: authHeader()});
    }

    getModeratorBoard() {
        return axios.get(USER_API_BASE_URL + 'mod', {headers: authHeader()});
    }

    getAdminBoard() {
        return axios.get(USER_API_BASE_URL + 'admin', {headers: authHeader()});
    }
}

export default UserService();
