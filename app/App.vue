<template>
  <v-app>
    <v-main>
      <Leaderboard
        :challenge-id="challengeId"
        :by-team-default="byTeamDefault"
        :default-task="defaultTask"
      />
    </v-main>
  </v-app>
</template>

<script>
import Leaderboard from '../src/components/Leaderboard.vue';

export default {
  name: 'App',
  components: {
    Leaderboard,
  },
  props: {
    challengeId: {
      type: Number,
      required: true,
    },
    byTeamDefault: {
      type: Boolean,
      default: false,
    },
    defaultTask: {
      type: Number,
      default: undefined,
    },
  },
};
</script>
