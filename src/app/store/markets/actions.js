// import { serialize } from '@/utils/helpers/serialize';

// export default {
//   getCoinsMarkets(context, data) {
//     const dataSerialize = serialize(data);
//     console.log('dataSerialize', dataSerialize.includes('category'));
//     return this._vm.$api.get(`/crypto-markets?${dataSerialize}`, {}).then((data) => {
//       context.commit('setCoinsMarkets', data);
//     });
//   },
// };

import axios from 'axios';
import { serialize } from '@/utils/helpers/serialize';
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
      return axios.get(`${configs.LARAVEL_API_URL}/crypto-markets?${dataSerialize}`, config).then((data) => {
        context.commit('setCoinsMarkets', data.data);
      });
    } else if (dataSerialize.includes('available_supply')) {
      // if available_supply exists
      return axios.get(`${configs.LARAVEL_API_URL}/crypto-markets?${dataSerialize}`, config).then((data) => {
        context.commit('setCoinsMarkets', data.data);
      });
    } else {
      // Use default
      return this._vm.$api.get(`/crypto-markets?${dataSerialize}`, {}).then((data) => {
        context.commit('setCoinsMarkets', data);
      });
    }
  },
};
