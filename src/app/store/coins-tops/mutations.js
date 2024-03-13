export default {
  setTopLosers(state, payload) {
    state.losers = payload
  },
  setTopGainers(state, payload) {
    state.gainers = payload
  },
};
