<template>
  <v-app>
    <v-main>
      <Leaderboard
        :challenge-id="challengeId"
        :by-team-default="byTeamDefault"
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
  data() {
    return {
      challengeId: process.env.VUE_APP_CHALLENGE_ID,
      byTeamDefault: process.env.VUE_APP_BY_TEAM_DEFAULT === 'true',
    };
  },
};
</script>
