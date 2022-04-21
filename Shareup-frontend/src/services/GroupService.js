import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";

const USER_API_BASE_URL =  `${settings.apiUrl}/api/v1/groups`
let authAxios = null;

const authenticate = () => {
    if(AuthService.getCurrentUser()){
        authAxios = axios.create({
            baseURL: USER_API_BASE_URL,
            headers: {
                'Authorization': `Bearer ${AuthService.getCurrentUser().jwt}`,
                'Access-Control-Allow-Origin': "*"
            }
        })
    }else{
        authAxios = axios.create({
            baseURL: USER_API_BASE_URL
        })
    }
}
authenticate();

class GroupService {
    createGroup = async (uid, formdata) => {
        const result = await authAxios.post(`/${uid}/create`,formdata)
        return result;
    }
    uploadGroupCoverImage = async (gid ,formdata) =>{
        const result = await authAxios.post(`/upload_cover_image/${gid}`,formdata)
        return result;
    }
    uploadGroupImage = async (gid ,formdata) =>{
        const result = await authAxios.post(`/upload_image/${gid}`,formdata)
        return result;
    }
    getAllGroups = async () => {
        authenticate();
        const result = await authAxios.get('')
        return result;
    }
    getGroupMembers = async (gid) => {
        authenticate();
        const result = await authAxios.get(`/${gid}/members`)
        return result;
    }

    getGroupById = async (id) => {
        const result = await authAxios.get(`/id/${id}`)
        return result;
    }

    getGroupByCurrentUser = async (uid) => {
        const result = await authAxios.get(`/group_id/${uid}`)
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
    deleteGroup = async (oid, gid) => {
        const result = await authAxios.delete(`/${oid}/delete/${gid}`)
        return result
    }
    addAdmin = async (uid ,gid) => {
        const result = await authAxios.post(`/${gid}/add_admin/${uid}`)
        return result

    }
    inviteMember = async (gid,uid,fid) => {
        const result = await authAxios.post(`/${gid}/${uid}/invite/${fid}`)
        return result
    }
    removeMember = async (aid,gid,uid) => {
        const result = await authAxios.delete(`${aid}/${gid}/delete/${uid}`)
        return result;
    }

}

export default new GroupService();