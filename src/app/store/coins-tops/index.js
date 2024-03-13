import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  state() {
    return {
      gainers: [],
      losers: [],
    };
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
};
