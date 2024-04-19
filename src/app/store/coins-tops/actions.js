import { apiInstance } from "@/utils/helpers/api-client";
import configs from '../../../configs/configs';
import axios from 'axios';
export default {
  getTopLosers({ commit }) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return axios.get(`${configs.API_URL}/coins/top-losers`, config)
      .then(({ data }) => {
        commit('setTopLosers', data.losers);
      })
      .catch(error => {
        console.error('Error fetching top losers:', error);
        throw error;
      });
  },
  getTopGainers({ commit }) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return axios.get(`${configs.API_URL}/coins/top-gainers`, config)
      .then(({ data }) => {
        commit('setTopGainers', data.gainers);
      })
      .catch(error => {
        console.error('Error fetching top gainers:', error);
        throw error;
      });
  },
};
