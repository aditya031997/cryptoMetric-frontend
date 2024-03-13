import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import getInitialState from './state';
import user from './user';
import widgets from './widgets';
import favorites from './favorites';
import news from './news';
import trends from './trends';
import alerts from './alerts';
import latest from './latest';
import markets from './markets';
import calendar from './calendar';
import coins from './coins';
import admin from './admin';
import coinTops from './coins-tops';

Vue.use(Vuex);

const state = getInitialState();

export default new Vuex.Store({
  state,
  modules: {
    user,
    favorites,
    widgets,
    trends,
    alerts,
    latest,
    news,
    markets,
    calendar,
    coins,
    admin,
    history,
    coinTops,
  },
  getters,
  actions,
  mutations,
  plugins: [],
});
