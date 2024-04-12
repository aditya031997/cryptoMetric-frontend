import { getCurrentInstance } from "vue";
import { apiInstance } from "@/utils/helpers/api-client";

const api = getCurrentInstance()?.appContext.config.globalProperties?.$api;

export default {
  getFavorites(context) {
    return apiInstance()?.get('/coins/favorites').then(({ coins }) => {
      context.commit('setFavorites', coins);
    });
  },
  postChangeFavorite(context, data) {
    return apiInstance()?.post('/coins/favorites', {
      coin_id: data.coin.coin_id || data.coin.id,
      in_favorite: !data.state,
    })
      .then(() => {
        context.commit('changeFavorite', data);
      });
  },
  postFavoritesDND(context, data) {
    const coins = data.map((value, index) => {
      value.position = index;
      return value;
    });
    return apiInstance()?.post('/coins/favorites/positions',{ favorites: coins }).then(() => {
      context.commit('updateFavorites', data);
    });
  },
};
