import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  state() {
    return {
      news: [],
      current: 1,
      total: 1,
    };
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
};
