<template>
  <v-app>
    <v-content>
      <v-toolbar>
        <v-toolbar-title>ISIC Challenge 2018 Leaderboard</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-tabs dark>
        <v-tab>
          Task 1: Lesion Boundary Segmentation
        </v-tab>
        <v-tab-item>
          <Leaderboard phase-id="5b1c193356357d41064da2ec"/>
        </v-tab-item>

        <v-tab>
          Task 2: Lesion Attribute Detection
        </v-tab>
        <v-tab-item>
          <Leaderboard phase-id="5b1c1a9f56357d41064da2f6"/>
        </v-tab-item>

        <v-tab>
          Task 3: Lesion Diagnosis
        </v-tab>
        <v-tab-item>
          <Leaderboard phase-id="5b1c1aa756357d41064da300"/>
        </v-tab-item>
      </v-tabs>
    </v-content>
  </v-app>
</template>

<script>
import Leaderboard from './components/Leaderboard.vue';

export default {
  name: 'App',

  components: {
    Leaderboard,
  },
};
</script>
