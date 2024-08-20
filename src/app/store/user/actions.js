import { apiInstance } from "@/utils/helpers/api-client";
import axios from 'axios';
import accessToken from '../../utils/helpers/access-token';
import configs from '../../../configs/configs';


export default {
  getUser(context) {
    return apiInstance()?.get('/user').then((data) => {
      context.commit('setUser', data);
    });
  },
  changeEmailStatus(context, data) {
    return apiInstance()?.post('/user/email-news-status', { status: data.status }).then(() => {
      context.commit('changeEmailStatus', data.name);
    });
  },
  changeTheme(context, data) {
    const endpoint = `${configs.API_URL}/user/chart-theme`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.get()}`
    };

    return axios.post(endpoint, { chart_theme: data }, { headers }).then(() => {
      context.commit('updateChartTheme', data);
    })
      .catch((error) => {
        console.error("Error updating chart theme:", error);
        throw error;
      });
  },
  changeUserInfo(context, data) {
    const endpoint = `${configs.API_URL}/profile`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.get()}`
    };
    return axios.patch(endpoint, data, { headers })
      .then(() => {
        context.commit('updateUserInfo', data);
      })
      .catch((error) => {
        console.error("Error updating user info:", error);
        throw error;
      });
  },
updatePassword(context, data) {
  const endpoint = `${configs.API_URL}/profile/update-password`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken.get()}`,
  };

  return axios.patch(endpoint, data, { headers })
    .then((response) => {
      // context.commit('updatePassword', response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error updating password:", error);
      throw error;
    });
}
};
