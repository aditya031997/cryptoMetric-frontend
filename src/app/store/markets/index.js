import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  state() {
    return {
      coins: [],
      allCoins: null,
    };
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
};
