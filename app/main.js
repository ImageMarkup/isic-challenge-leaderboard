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

function optionalInt(value) {
  const parsedValue = parseInt(value, 10);
  return Number.isNaN(parsedValue) ? undefined : parsedValue;
}

function optionalBool(value) {
  const lowerValue = value.toLowerCase();
  if (lowerValue === 'true') {
    return true;
  }
  if (lowerValue === 'false') {
    return false;
  }
  return undefined;
}

new Vue({
  store,
  vuetify: new Vuetify({}),
  render(h) {
    const { dataset } = this.$el;
    const props = {
      challengeId: optionalInt(dataset.challengeId ?? process.env.VUE_APP_CHALLENGE_ID),
      byTeamDefault: optionalBool(dataset.byTeamDefault ?? process.env.VUE_APP_BY_TEAM_DEFAULT),
      defaultTask: optionalInt(dataset.defaultTask ?? process.env.VUE_APP_DEFAULT_TASK),
    };
    return h(App, {props});
  },
}).$mount('#app');
