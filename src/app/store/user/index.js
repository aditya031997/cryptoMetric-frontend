import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  state() {
    return {
      data: null,
    };
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
};
