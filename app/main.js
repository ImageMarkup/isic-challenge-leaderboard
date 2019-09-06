import '@babel/polyfill';
import Vue from 'vue';

// Vuetify
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

// Vuex
import Vuex from 'vuex';
import store from '../src/store';

// Root app
import App from './App.vue';

Vue.use(Vuetify);
Vue.use(Vuex);
Vue.config.productionTip = false;

new Vue({
  store: new Vuex.Store(store),
  vuetify: new Vuetify({}),
  render: h => h(App),
}).$mount('#app');
