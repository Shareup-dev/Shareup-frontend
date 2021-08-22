import axios from 'axios';
import AuthService from './auth.services';

const USER_API_BASE_URL = 'http://localhost:8080/api/v1/groups'
let authAxios = null;

const authenticate = () => {
    if(AuthService.getCurrentUser()){
        authAxios = axios.create({
            baseURL: 'http://192.168.100.2:8080/api/v1/groups',
            headers: {
                'Authorization': `Bearer ${AuthService.getCurrentUser().jwt}`,
                'Access-Control-Allow-Origin': "*"
            }
        })
    }else{
        authAxios = axios.create({
            baseURL: 'http://192.168.100.2:8080/api/v1/groups'
        })
    }
}
authenticate();

class GroupService {
    createGroup = async (uid, formdata) => {
        const result = await authAxios.post(`/${uid}/create`,formdata)
        return result;
    }

    getAllGroups = async () => {
        authenticate();
        const result = await authAxios.get('')
        return result;
    }

    getGroupById = async (id) => {
        const result = await authAxios.get(`/id/${id}`)
        return result;
    }

    getGroupByCurrentUser = async (email) => {
        const result = await authAxios.get(`/email/${email}`)
        return result;
    }

    getGroupsPostsById = async (id) => {
        const result = await authAxios.get(`/posts/${id}`)
        return result;
    }

    joinGroup = async (uid, gid) => {
        const result = await authAxios.post(`/${uid}/join/${gid}`)
        return result
    }

    leaveGroup = async (uid, gid) => {
        const result = await authAxios.delete(`/${uid}/leave/${gid}`)
        return result
    }
}

export default new GroupService();