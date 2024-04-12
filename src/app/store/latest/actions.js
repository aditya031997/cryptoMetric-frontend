import { apiInstance } from "@/utils/helpers/api-client";

export default {
  getLatestNews(context, page) {
    return apiInstance()?.get('/news/latest',{ page }).then(({ news }) => {

    // return this._vm.$api.get('/news/latest', { page }).then(({ news }) => {
      context.commit('setLatestNews', news);
    });
  },
};
