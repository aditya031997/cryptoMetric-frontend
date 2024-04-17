import { apiInstance } from "@/utils/helpers/api-client";
import axios from 'axios';
import configs from '../../../configs/configs';

export default {
  getHistoryAlerts({ commit, state }, data) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const { isEcho, page, per_page } = data;
    return axios.get(`${configs.API_URL}/alerts/history`, {
      headers: config.headers,
      params: isEcho ? { page: state.current, per_page } : { page, per_page },
    })
    .then(response => {
      commit('setHistoryAlerts', response.data.alerts);
    })
    .catch(error => {
      console.error('Error fetching history alerts:', error);
      throw error;
    });
  },
  getAlertsUser(context) {
    return apiInstance().get('/alerts').then(({ alerts }) => {
      context.commit('setAlertsUser', alerts);
    });
  },
  postCreateAlert(context, data) {
    return apiInstance()?.post('/alerts', data.data).then(({ alert }) => {
      const alertCreated = { ...alert, ...data.coin };
      context.commit('setCreatedAlert', alertCreated);
    });
  },
  deleteAlertUser(context, id) {
    return apiInstance().delete(`/alerts/${id}`).then(() => {
      context.commit('deleteAlertUser', id);
    });
  },
  changeStatusAlertUser({ commit }, data) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return axios.post(`${configs.API_URL}/alerts/toggle-status`, data, { headers: config.headers })
      .then(() => {
        commit('changeStatusAlertUser', data);
      })
      .catch((error) => {
        console.error('Error changing status of alert user:', error);
        throw error;
      });
  },
  changeStatusAlertEmail(context, data) {
    return apiInstance()?.post('/alerts/toggle-email-status', data).then(() => {
      context.commit('setStatusAlertEmail', data.status);
    });
  },
};
