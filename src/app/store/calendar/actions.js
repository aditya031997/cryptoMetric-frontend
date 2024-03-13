import { serialize } from '@/utils/helpers/serialize';

export default {
  getProjectsICO(context, data) {
    return this._vm.$api.get(`/ico?${serialize(data)}`).then((value) => {
      context.commit('setProjectsICO', value);
    });
  },
};
