import Vue from 'vue';
import Vuetify, { VIcon, VTooltip } from 'vuetify/lib';

Vue.use(Vuetify, {
  // These are used within functional components, and thus need to be explicitly registered
  components: { VIcon, VTooltip },
});

export default new Vuetify({});
