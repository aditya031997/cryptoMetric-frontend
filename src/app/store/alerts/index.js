import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  state() {
    return {
      alerts: [],
      total: 0,
      current: 1,
      totalPage: 1,
      alertsUser: [],
      links: [],
    };
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
};
