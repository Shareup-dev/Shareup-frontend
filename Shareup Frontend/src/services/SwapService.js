import axios from 'axios';
import AuthService from './auth.services';

let authAxios = null;

const authenticate = () => {
    if(AuthService.getCurrentUser()){
        authAxios = axios.create({
            baseURL: 'http://192.168.100.2:8080/api/v1/',
            headers: {
                
                Authorization: `Bearer ${AuthService.getCurrentUser().jwt}`
            }
        })
    }else{
        authAxios = axios.create({
            baseURL: 'http://192.168.100.2:8080/api/v1/'
        })
    }
}
authenticate();

class SwapService {
    getSwap = async () => {
        authenticate();
        const result = await authAxios.get('swaps/')
        return result;
    }

    // getPostForUser = async (id) => {
    //     authenticate();
    //     const result = await authAxios.get(`posts/${id}`)
    //     return result;
    // }

    getSwapForUser = async (email) => {
        authenticate();
        const result = await authAxios.get(`swaps/${email}`)
        return result;
    }

    getSavedSwapForUser = async (email) => {
        authenticate();
        const result = await authAxios.get(`swaps/${email}/saved_swaps`)
        return result;
    }

    createSwap = async (userId, formdata) => {
        const result = await authAxios.post(`swaps/${userId}`,formdata)
        return result
    }

    updateSwap = async (swapId, swap) => {
        const result = await authAxios.put(`swaps/${swapId}`, swap)
        return result;
    }

    deleteSwap = async (swapid) => {
        const result = await authAxios.delete(`swaps/${swapid}`)
        return result
    }

    addComment = async (userid, swapid, comment) => {
        const result = await authAxios.post(`comment/${userid}/${swapid}`, comment)
        return result
    }

    deleteComment = async (commentid) => {
        const result = await authAxios.delete(`comment/${commentid}`)
        return result
    }
}

export default new SwapService();