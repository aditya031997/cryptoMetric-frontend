// import * as _ from 'lodash';
import { Decimal } from 'decimal.js';
import '@/assets/scss/index.scss';
import './rules/index.js';

import Vue, { createApp } from 'vue';
import Vuex from 'vuex';
import uuid from 'vue-uuid';

import App from './App.vue';
import store from './store/index';
import router from './router/index';

import apiClient from './utils/helpers/api-client.js';
import configs from '#/configs/configs';
import lodash from 'lodash';

// window._ = _;
// Object.defineProperty(Vue.prototype, '$decimal', { value: Decimal });
// Object.defineProperty(Vue.prototype, '$_', { value: lodash });

Vue.use(Vuex);
Vue.use(uuid);

// Vue.prototype.$api = ApiClient;
Vue.prototype.$configs = configs;


const app = createApp(App)

app.config.globalProperties.$api = apiClient;



app.use(store);
app.use(router)
app.mount('#app');


/** old vue syntax */
// const main = new Vue({
//   store,
//   router,
//   el: '#app',
//   render: (h) => h(App),
// });
