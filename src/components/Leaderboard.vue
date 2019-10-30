<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>{{ challenge.name }} Leaderboards</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-switch
          v-model="byTeam"
          class="align-self-end"
          label="Group By Team"
        />
      </v-toolbar-items>
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
          <TaskLeaderboard
            :task-id="task.id"
            :by-team="byTeam"
          />
        </v-tab-item>
      </template>
    </v-tabs>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import TaskLeaderboard from './TaskLeaderboard.vue';

export default {
  name: 'Leaderboard',

  components: {
    TaskLeaderboard,
  },

  props: {
    challengeId: {
      type: String,
      required: true,
    },
    byTeamDefault: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      byTeam: this.byTeamDefault,
    };
  },

  computed: {
    ...mapState('leaderboard', [
      'challenge',
      'tasks',
    ]),
  },

  async created() {
    await this.loadChallenge({ challengeId: this.challengeId });
  },

  methods: {
    ...mapActions('leaderboard', [
      'loadChallenge',
    ]),
  },
};
</script>

<style scoped lang="stylus">
  .v-tabs
    .v-tabs-bar
      height 61px

      .v-tab
        margin 6px 6px 0

        &.v-tab--active
          background #fff
          border-top 2px solid #1976d2
          color #757575
</style>
