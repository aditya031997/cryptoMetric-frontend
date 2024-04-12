import { serialize } from '@/utils/helpers/serialize';
import { apiInstance } from "@/utils/helpers/api-client";

export default {
  getProjectsICO(context, data) {
    return apiInstance()?.get(`/ico?${serialize(data)}`).then((value) => {
      context.commit('setProjectsICO', value);
    });
  },
};
