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
    editGroup = async (gid, formdata) => {
        const result = await authAxios.put(`/${gid}/edit_group`,formdata)
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
    getMyGroups = async (email) => {
        // authenticate();
        const result = await authAxios.get(`/my_groups/${email}`)
        return result;
    }
    getAdmins = async (gid) => {
        // authenticate();
        const result = await authAxios.get(`/${gid}/list_admins`)
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
    getAllMemberRequests = async (gid) => {
        const result = await authAxios.get(`/${gid}/member_requests`)
        return result;
    }
    getAllGroupInvitations = async (gid) => {
        const result = await authAxios.get(`/${gid}/group_invitations`)
        return result;
    }
    getGroupInvitedOrNot = async (uid,gid) => {
        const result = await authAxios.get(`/${uid}/invited_or_not/${gid}`)
        return result;
    }
    getGroupNewsFeed = async (gid) =>{
        const result = await authAxios.get(`/group_feed/${gid}`)
        return result;
    }
    getMyJoinRequests = async (uid) => {
        const result = await authAxios.get(`/${uid}/my_requests`)
        return result;
    }
    joinRequestSent = async (uid,gid) => {
        const result = await authAxios.get(`/${uid}/did_request_join/${gid}`)
        return result;
    }
    joinGroup = async (uid, gid) => {
        const result = await authAxios.post(`/${uid}/join/${gid}`)
        return result
    }
    joinRequestGroup = async (uid, gid) => {
        const result = await authAxios.post(`/${uid}/Join_group/${gid}`)
        return result
    }
    cancelRequestGroup = async (rid) => {
        const result = await authAxios.delete(`/delete_request/${rid}`)
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
    acceptMemberRequest = async (rid) =>{
        const result = await  authAxios.put(`/accept_member_requests/${rid}`)
        return result;

    }
    rejectMemberRequest = async (rid) =>{
        const result = await  authAxios.put(`/reject_member_requests/${rid}`)
        return result;

    }
    acceptInvite = async (rid) =>{
        const result = await  authAxios.put(`/accept_invite/${rid}`)
        return result;

    }    

}

export default new GroupService();