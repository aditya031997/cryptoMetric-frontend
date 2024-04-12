import { apiInstance } from "@/utils/helpers/api-client";
export default {
  getTopLosers(context) {
    return apiInstance()?.get('/coins/top-losers').then(({ losers }) => {
      context.commit('setTopLosers', losers);
    });
  },
  getTopGainers(context) {
    return apiInstance()?.get('/coins/top-gainers').then(({ gainers }) => {
      context.commit('setTopGainers', gainers);
    });
  },
};
