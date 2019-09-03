<template>
  <v-app>
    <v-content>
      <Leaderboard :challenge-id="challengeId" />
    </v-content>
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
    };
  },
};
</script>
