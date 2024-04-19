import { apiInstance } from "@/utils/helpers/api-client";
import configs from '../../../configs/configs';
import axios from 'axios';
export default {
  getLatestNews({ commit }, page) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios.get(`${configs.API_URL}/news/latest`, {
      headers: config.headers,
      params: { page },
    })
      .then(({ data }) => {
        commit('setLatestNews', data.news);
      })
      .catch(error => {
        console.error('Error fetching latest news:', error);
        throw error;
      });
  },
};
