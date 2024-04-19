import { apiInstance } from "@/utils/helpers/api-client";
import accessToken from '../../utils/helpers/access-token';
import configs from '../../../configs/configs';
import axios from 'axios';

export default {
  getCoinsNames(context) {
    return axios.get(`${configs.API_URL}/coins/names`, {
      headers: {
        Authorization: `Bearer ${accessToken.get()}`,
      },
    })
    .then((response) => {
      context.commit('setCoinsNames', response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('Error getting coin names:', error);
      throw error;
    });
  },
};