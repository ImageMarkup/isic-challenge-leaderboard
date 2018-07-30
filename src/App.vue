<template>
  <v-app>
    <v-content>
      <v-toolbar>
        <v-toolbar-title>ISIC Challenge Manuscript Review</v-toolbar-title>
        <v-spacer></v-spacer>
        <span>Current user: {{ user.firstName }} {{ user.lastName }} ({{ user.login }})</span>
      </v-toolbar>
      <v-tabs dark>
        <v-tab>
          Task 1: Lesion Boundary Segmentation
        </v-tab>
        <v-tab-item>
          <Leaderboard phase-id="5b1c193356357d41064da2ec" :user="user"/>
        </v-tab-item>

        <v-tab>
          Task 2: Lesion Attribute Detection
        </v-tab>
        <v-tab-item>
          <Leaderboard phase-id="5b1c1a9f56357d41064da2f6" :user="user"/>
        </v-tab-item>

        <v-tab>
          Task 3: Lesion Diagnosis
        </v-tab>
        <v-tab-item>
          <Leaderboard phase-id="5b1c1aa756357d41064da300" :user="user"/>
        </v-tab-item>
      </v-tabs>
    </v-content>
  </v-app>
</template>

<script>
import http from './http';
import Leaderboard from './components/Leaderboard.vue';

export default {
  name: 'App',

  components: {
    Leaderboard,
  },

  data() {
    return {
      user: {},
    };
  },

  async created() {
    await this.loadUser();
  },

  methods: {
    async loadUser() {
      try {
        const userResponse = await http.request({
          method: 'get',
          url: 'user/me',
          withCredentials: false,
          responseType: 'json',
        });

        this.user = userResponse.data;
      } catch (e) {
        // Shouldn't happen
      }
    },
  },
};
</script>
