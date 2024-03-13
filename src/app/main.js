import * as _ from 'lodash';
import { Decimal } from 'decimal.js';
import '@/assets/scss/index.scss';
import './rules/index.js';

import Vue from 'vue';
import Vuex from 'vuex';
import uuid from 'vue-uuid';

import App from './App.vue';
import store from './store/index';
import router from './router/index';

import ApiClient from '@/utils/helpers/api-client';
import configs from '#/configs/configs';


window._ = _;
Object.defineProperty(Vue.prototype, '$decimal', { value: Decimal });
Object.defineProperty(Vue.prototype, '$_', { value: _ });

Vue.use(Vuex);
Vue.use(uuid);


Vue.prototype.$api = ApiClient;
Vue.prototype.$configs = configs;

const main = new Vue({
  store,
  router,
  el: '#app',
  render: (h) => h(App),
});
