export default {
  setFavorites(state, payload) {
    state.coins = payload;
  },
  addFavorite(state, payload) {
    state.coins.push(payload);
  },
  deleteFavorite(state, payload) {
    const indexFavorite = state.coins.findIndex((value) => value.coin_id === payload);
    state.coins.splice(indexFavorite, 1);
  },
  changeFavorite(state, payload) {
    if (payload.state) {
      const indexFavorite = state.coins.findIndex(
        (coin) => coin.coin_id === payload.coin.coin_id || coin.coin_id === payload.coin_id
      );
      if (indexFavorite !== -1) {
        state.coins.splice(indexFavorite, 1);
      }
    } else {
      state.coins.push(payload.coin);
    }
  },
  createCopyDndFavorites(state) {
    state.dndCopyFavorites = state.coins;
  },
  cancelChangedDndFavorites(state) {
    state.coins = state.dndCopyFavorites;
  },
  updateFavorites(state, data) {
    state.coins = data;
  },
};
