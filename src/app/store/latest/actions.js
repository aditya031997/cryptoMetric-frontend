export default {
  getLatestNews(context, page) {
    return this._vm.$api.get('/news/latest', { page }).then(({ news }) => {
      context.commit('setLatestNews', news);
    });
  },
};
