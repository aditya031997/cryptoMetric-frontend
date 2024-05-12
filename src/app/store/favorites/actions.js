import { getCurrentInstance } from "vue";
import { apiInstance } from "@/utils/helpers/api-client";
import axios from 'axios';
import configs from '../../../configs/configs';
const api = getCurrentInstance()?.appContext.config.globalProperties?.$api;

export default {
  getFavorites(context) {
    return apiInstance()?.get('/coins/favorites').then(({ coins }) => {
      context.commit('setFavorites', coins);
    });
  },
  postChangeFavorite({ commit }, data) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios.post(`${configs.API_URL}/coins/favorites`, {
      coin_id: data.coin.coin_id || data.coin.id,
      in_favorite: !data.state,
    }, { headers: config.headers })
      .then(() => {
        commit('changeFavorite', data);
      })
      .catch((error) => {
        console.error('Error changing favorite coin:', error);
        throw error;
      });
  },
  postFavoritesDND(context, data) {
    const coins = data.map((value, index) => {
      value.position = index;
      return value;
    });
    return apiInstance()?.post('/coins/favorites/positions', { favorites: coins }).then(() => {
      context.commit('updateFavorites', data);
    });
  },
};
