import { serialize } from '@/utils/helpers/serialize';
import { apiInstance } from "@/utils/helpers/api-client";
import axios from 'axios';
import configs from '../../../configs/configs';
export default {
  getProjectsICO({ commit }, data) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios.get(`${configs.API_URL}/ico?${serialize(data)}`, { headers: config.headers })
      .then((response) => {
        commit('setProjectsICO', response.data);
      })
      .catch((error) => {
        console.error('Error fetching ICO projects:', error);
        throw error;
      });
  }
};
