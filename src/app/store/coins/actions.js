export default {
  getCoinsNames(context, page) {
    return this._vm.$api.get('/coins/names').then((data) => {
      context.commit('setCoinsNames', data);
    });
  },
};
