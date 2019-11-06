import Vue from 'vue';

// Vuetify
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

// Vuex
import Vuex from 'vuex';

// Leaderboard
import leaderboardPlugin from '../src/plugin';

// Root app
import App from './App.vue';

Vue.use(Vuetify);

Vue.use(Vuex);
const store = new Vuex.Store({});
leaderboardPlugin(store);

Vue.config.productionTip = false;

new Vue({
  store,
  vuetify: new Vuetify({}),
  render: h => h(App),
}).$mount('#app');
