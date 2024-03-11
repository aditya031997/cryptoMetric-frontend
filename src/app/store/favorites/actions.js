export default {
  getFavorites(context) {
    return this._vm.$api.get('/coins/favorites').then(({ coins }) => {
      context.commit('setFavorites', coins);
    });
  },
  postChangeFavorite(context, data) {
    return this._vm.$api
      .post('/coins/favorites', {
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
    return this._vm.$api.post('/coins/favorites/positions', { favorites: coins }).then(() => {
      context.commit('updateFavorites', data);
    });
  },
};
