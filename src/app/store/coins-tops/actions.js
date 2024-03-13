export default {
  getTopLosers(context, data) {
    return this._vm.$api.get('/coins/top-losers').then(({ losers }) => {
      context.commit('setTopLosers', losers);
    });
  },
  getTopGainers(context, data) {
    return this._vm.$api.get('/coins/top-gainers').then(({ gainers }) => {
      context.commit('setTopGainers', gainers);
    });
  },
};
