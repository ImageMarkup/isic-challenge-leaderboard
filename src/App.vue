<template>
  <v-app>
    <v-content>
      <v-toolbar>
        <v-toolbar-title>ISIC Challenge 2018 Leaderboards</v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <v-tabs dark>
        <template v-for="(task, taskNum) in tasks">
          <v-tab :key="`tab-${task.id}`">
            Task {{ taskNum }}: {{ task.name }}
          </v-tab>
          <v-tab-item :key="`item-${task.id}`">
            <Leaderboard :task-num="taskNum"/>
          </v-tab-item>
        </template>
      </v-tabs>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Leaderboard from './components/Leaderboard.vue';

export default {
  name: 'App',

  components: {
    Leaderboard,
  },

  computed: {
    ...mapState([
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
