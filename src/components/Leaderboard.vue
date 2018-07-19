<template>
  <v-data-table
    :headers="headers"
    :items="submissions"
    :loading="loading"
    hide-actions
    must-sort
  >
    <template slot="items" slot-scope="{ item: submission, expanded }">
      <td>
        {{ submission.rank }}
      </td>
      <td>
        <a :href="submission.organizationUrl">{{ submission.organization }}</a>
        <br>
        <i>({{ submission.creatorName }})</i>
        <v-alert
          v-if="admin"
          :value="true"
          color="info"
        >
          Team URL: <code>{{ submission.organizationUrl }}</code>
        </v-alert>
      </td>
      <td>
        {{ submission.approach }}
      </td>
      <td>
        <template v-if="arxivId(submission.documentationUrl)">
          <a :href="submission.documentationUrl">{{ arxivId(submission.documentationUrl) }}</a>
        </template>
        <template v-else>
          <v-icon color="red">close</v-icon>
          <v-alert
            v-if="admin"
            :value="true"
            color="info"
          >
            <code>{{ submission.documentationUrl }}</code>
          </v-alert>
        </template>
      </td>
      <td>
        <template v-if="submission.meta.usesExternalData">
          <v-icon color="orange">public</v-icon>
          Yes
        </template>
        <template v-else>
          <v-icon color="blue">vpn_lock</v-icon>
          No
        </template>
      </td>
      <td v-if="admin">
        <v-icon v-if="submission.meta.agreeToSharingPolicy" color="green">check</v-icon>
        <v-icon v-else color="red">close</v-icon>
      </td>
      <td>
        <v-tooltip bottom>
          <span slot="activator">{{ submission.overallScore.toPrecision(3) }}</span>
          <span>{{ submission.overallScore }}</span>
        </v-tooltip>

      </td>
    </template>
    <template slot="footer">
      <input type="checkbox" id="leaderboard-admin" v-model="admin">
      <label for="leaderboard-admin">Admin mode</label>
    </template>
  </v-data-table>
</template>

<script>
import http from '../http';

export default {
  name: 'Leaderboard',

  props: {
    phaseId: String,
  },

  data() {
    return {
      admin: false,
      submissions: [],
      loading: true,
    };
  },

  async created() {
    try {
      const submissionsResponse = await http.request({
        method: 'get',
        url: 'covalic_submission',
        params: {
          limit: 0,
          offset: 0,
          sort: 'overallScore',
          sortdir: -1,
          phaseId: this.phaseId,
        },
        withCredentials: false,
        responseType: 'json',
      });
      submissionsResponse.data.forEach((submission, index) => {
        submission.rank = index + 1;
      });

      this.submissions = submissionsResponse.data;
    } catch (e) {
      // TODO: Covalic may 401 here if the phase scores are hidden and the user isn't logged in
    }

    this.loading = false;
  },

  computed: {
    submissionsWithoutExternalData() {
      return this.submissions.filter(submission => !submission.meta.usesExternalData);
    },

    headers() {
      return [
        {
          text: 'Rank',
          value: 'rank',
        },
        {
          text: 'Team',
          value: 'organization',
        },
        {
          text: 'Approach Name',
          value: 'approach',
          sortable: false,
        },
        {
          text: 'arXiv Abstract',
          value: 'documentationUrl',
          sortable: false,
        },
        {
          text: 'Used External Data',
          value: 'meta.usesExternalData',
        },
        ...(
          this.admin ?
            [{
              text: 'Agreed To Sharing Policy',
              value: 'meta.agreeToSharingPolicy',
            }]
            : []
        ),
        {
          text: 'Final Score (Balanced Multi-class Accuracy)',
          value: 'overallScore',
        },
      ];
    },
  },

  methods: {
    arxivId(documentationUrl) {
      // TODO: make this a computed property of a sub-component
      const arxivRegex = /^https?:\/\/arxiv\.org\/abs\/([0-9.]+)$/;
      const arxivMatch = arxivRegex.exec(documentationUrl);
      return arxivMatch ? arxivMatch[1] : null;
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
</style>
