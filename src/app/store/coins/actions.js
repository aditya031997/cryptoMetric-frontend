import { apiInstance } from "@/utils/helpers/api-client";

export default {
  getCoinsNames(context) {
    return apiInstance()?.get('/coins/names').then(({ data }) => {
      context.commit('setCoinsNames', data);
    });
  },
};
