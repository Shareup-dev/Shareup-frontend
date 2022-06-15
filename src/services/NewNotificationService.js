
import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";

let authAxios = null;
const USER_API_BASE_URL =  `${settings.apiUrl}`
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

class NewNotificationService
{
    getNotifications = async (username) => {
        authenticate();
        const result = await authAxios.get(`/my_notifications/${username}`)
        return result;
    }
    readNotification = async (nid) => {
        const result = await authAxios.put(`/read_notification/${nid}`)
        return result;
    }
    getUnopenedNotificationsCount=async (email) => {
        authenticate();
        const result = await authAxios.get(`/no_of_unopen_notification/${email}`)
        return result;
    }
    updateUnopenedNotificationsCount= async (email,formData) => {
        const result = await authAxios.put(`/no_of_unopen_notification/${email}`,formData)
        return result;
    }
    sendNotification = async (uid,formData) => {
        const result = await authAxios.post(`/notification/${uid}`,formData)
        return result;
    }
}
export default new NewNotificationService();