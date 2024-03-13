export default {
  getNews(context, params) {
    return this._vm.$api.get('/news', { ...params }).then(({ emailNewsNotificationLevel, news }) => {
      context.commit('setNews', news);
    });
  },
  unsubscribeNews(context, params) {
    return this._vm.$api.post(`/news/${params.id}/unsubscribe`, undefined, { signature: params.signature });
  },
  unsubscribeAlerts(context, params) {
    return this._vm.$api.post(`/alerts/${params.id}/unsubscribe`, undefined, { signature: params.signature });
  },
};
