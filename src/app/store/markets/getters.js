export default {
  getCoinsListMarkets(state) {
    return state.coins;
  },
  getCoinsListMarketsLength(state) {
    return state.coins.length;
  },
  getAllCoins(state) {
    return state.allCoins;
  },
};
