
import axios from 'axios';
import { serialize } from '@/utils/helpers/serialize';
import { apiInstance } from "@/utils/helpers/api-client";
import configs from '../../../configs/configs';

export default {
  getCoinsMarkets(context, data) {
    const dataSerialize = serialize(data);
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (dataSerialize.includes('category')) {
      // if category exists
      return axios.get(`${configs.API_URL}/crypto-markets?${dataSerialize}`, config).then((data) => {
        context.commit('setCoinsMarkets', data.data);
      });
    } else if (dataSerialize.includes('available_supply')) {
      // if available_supply exists
      return axios.get(`${configs.API_URL}/crypto-markets?${dataSerialize}`, config).then((data) => {
        context.commit('setCoinsMarkets', data.data);
      });
    } else {
      return axios.get(`${configs.API_URL}/crypto-markets?${dataSerialize}`, config).then((data) => {
        context.commit('setCoinsMarkets', data.data);
      });
    }
  },
};
