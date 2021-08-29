import axios from 'axios';
import authHeader from '.auth-header';
import settings from "./Settings"
const baseURL = `${settings.apiUrl}/api/v1/test`;
// const USER_API_BASE_URL = 'http://192.168.100.2:8080/api/v1/test';

class UserService {
    getPublicContent() {
        return axios.get(baseURL + 'all')
    }

    getUserBoard() {
        return axios.get(baseURL + 'user', {headers: authHeader()});
    }

    getModeratorBoard() {
        return axios.get(baseURL + 'mod', {headers: authHeader()});
    }

    getAdminBoard() {
        return axios.get(baseURL + 'admin', {headers: authHeader()});
    }
}

export default UserService();
