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
  getAlertsUser({ commit }) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios.get(`${configs.API_URL}/alerts`, config)
      .then(({ data }) => {
        commit('setAlertsUser', data.alerts);
      })
      .catch(error => {
        console.error('Error fetching alerts:', error);
        throw error;
      });
  },
  postCreateAlert({ commit }, { data, coin }) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios.post(`${configs.API_URL}/alerts`, data, config)
      .then(({ data }) => {
        const alertCreated = { ...data.alert, ...coin };
        commit('setCreatedAlert', alertCreated);
      })
      .catch(error => {
        console.error('Error creating alert:', error);
        throw error;
      });
  },
  deleteAlertUser({ commit }, id) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios.delete(`${configs.API_URL}/alerts/${id}`, config)
      .then(() => {
        commit('deleteAlertUser', id);
      })
      .catch(error => {
        console.error('Error deleting alert:', error);
        throw error;
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
  changeStatusAlertEmail({ commit }, data) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios.post(`${configs.API_URL}/alerts/toggle-email-status`, data, config)
      .then(() => {
        commit('setStatusAlertEmail', data.status);
      })
      .catch(error => {
        console.error('Error changing alert email status:', error);
        throw error;
      });
  },
};
