import axios from 'axios';
import settings from '../configs/Settings';

const my_api = `${settings.apiUrl}/api/v1/users`;
const cookieKey = 'user';

class AuthService {
  setCurrentUser(data) {
    localStorage.setItem(cookieKey, JSON.stringify(data));
  }

  getCurrentUser = () => {
    const hasUser = localStorage.getItem(cookieKey)?.length > 0;

    if (!hasUser) return null;
    return JSON.parse(localStorage.getItem(cookieKey));
  };

  isLoggedIn = () => (this.getCurrentUser() ? true : false);

  login = async (username, password) => {
    let loginResponse = await axios.post(my_api + '/authenticate', {
      username,
      password,
    });

    console.log('login response', loginResponse);

    if (loginResponse.data.jwt) {
      this.setCurrentUser(loginResponse.data);
      console.log('localStorage.getItem(cookieKey)', localStorage.getItem(cookieKey));
    }

    return loginResponse;
  };

  logout() {
    localStorage.removeItem(cookieKey);
  }
}

export default new AuthService();
