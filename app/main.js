import Vue from 'vue';
import Vuex from 'vuex';
import '@mdi/font/css/materialdesignicons.css';
import vuetify from '../src/vuetify';

// Leaderboard
import leaderboardPlugin from '../src/plugin';

// Root app
import App from './App.vue';

Vue.use(Vuex);
const store = new Vuex.Store({});
leaderboardPlugin(store);

Vue.config.productionTip = false;

function optionalInt(value) {
  const parsedValue = parseInt(value, 10);
  return Number.isNaN(parsedValue) ? undefined : parsedValue;
}

function optionalBool(value) {
  if (value !== undefined) {
    const lowerValue = value.toLowerCase();
    if (lowerValue === 'true') {
      return true;
    }
    if (lowerValue === 'false') {
      return false;
    }
  }
  return undefined;
}

new Vue({
  store,
  vuetify,
  render(h) {
    const { dataset } = this.$el;
    const props = {
      challengeId: optionalInt(dataset.challengeId ?? process.env.VUE_APP_CHALLENGE_ID),
      byTeamDefault: optionalBool(dataset.byTeamDefault ?? process.env.VUE_APP_BY_TEAM_DEFAULT),
      defaultTask: optionalInt(dataset.defaultTask ?? process.env.VUE_APP_DEFAULT_TASK),
    };
    return h(App, { props });
  },
}).$mount('#app');
