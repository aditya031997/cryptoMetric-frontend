export default {
  setCoinsMarkets(state, data) {
    state.coins = data.data;
    state.allCoins = data.recordsFiltered;
  },
};
