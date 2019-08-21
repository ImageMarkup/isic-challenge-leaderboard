<template>
  <v-app>
    <v-content>
      <v-toolbar>
        <v-toolbar-title>{{ challenge.name }} Leaderboards</v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <v-tabs
        class="task-tabs"
        hide-slider
        dark
      >
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

<style lang="stylus">
.task-tabs .v-tabs__container
  height 61px

.task-tabs .v-tabs__div
  padding 6px 6px 0

.task-tabs .v-tabs__item
  padding-bottom 14px

.task-tabs .v-tabs__item.v-tabs__item--active
  background #fff
  border-top 2px solid #1976d2
  color #757575
  padding-bottom 12px
  padding-top 8px
</style>
