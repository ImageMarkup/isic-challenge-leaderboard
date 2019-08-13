<template>
  <v-app>
    <v-content>
      <v-toolbar>
        <v-toolbar-title>{{ challenge.name }} Leaderboards</v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <v-tabs dark>
        <template v-for="task in tasks">
          <v-tab :key="`tab-${task.id}`">
            {{ task.name }}
          </v-tab>
          <v-tab-item :key="`item-${task.id}`">
            <Leaderboard :task-id="task.id"/>
          </v-tab-item>
        </template>
      </v-tabs>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Leaderboard from '@/components/Leaderboard.vue';

export default {
  name: 'App',

  components: {
    Leaderboard,
  },

  data() {
    return {
    };
  },

  computed: {
    ...mapState([
      'challenge',
      'tasks',
    ]),
  },

  async created() {
    await this.loadAll();
  },

  methods: {
    ...mapActions([
      'loadAll',
    ]),
  },
};
</script>
