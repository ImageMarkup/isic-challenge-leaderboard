<template>
  <v-app>
    <v-content>
      <Leaderboard :challenge-id="'2019'" />
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
};
</script>
