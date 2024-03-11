import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  state() {
    return {
      list: [],
      order: [],
      orderDndCopy: [],
      listDndCopy: [],
    };
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
};
