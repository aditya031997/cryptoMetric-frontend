import { apiInstance } from "@/utils/helpers/api-client";

export default {
  getNews(context, params) {
    return apiInstance()?.get('/news', { ...params }).then(({ emailNewsNotificationLevel, news }) => {
    // return this._vm.$api.get('/news', { ...params }).then(({ emailNewsNotificationLevel, news }) => {
      context.commit('setNews', news);
    });
  },
  unsubscribeNews(params) {
    return apiInstance()?.post(`/news/${params.id}/unsubscribe`, undefined, { signature: params.signature });
    // return this._vm.$api.post(`/news/${params.id}/unsubscribe`, undefined, { signature: params.signature });
  },
  unsubscribeAlerts(params) {
    return apiInstance()?.post(`/alerts/${params.id}/unsubscribe`, undefined, { signature: params.signature });
    // return this._vm.$api.post(`/alerts/${params.id}/unsubscribe`, undefined, { signature: params.signature });
  },
};
