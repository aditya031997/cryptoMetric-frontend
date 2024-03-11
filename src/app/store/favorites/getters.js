export default {
  getFavorites(state) {
    return state.coins;
  },
  getTop5Coins(state) {
    return state.coins.slice(0, 5);
  },
};
