<template>
  <v-data-table
    :headers="headers"
    :items="qualifiedSubmissions"
    :loading="loading"
    hide-actions
    must-sort
  >
    <template slot="headerCell" slot-scope="{ header }">
      <div>
        {{ header.text }}
        <template v-if="header.countText">
          <br>
          &lt;{{ header.countText }}&gt;
        </template>
      </div>
    </template>
    <template slot="items" slot-scope="{ item: submission, expanded }">
      <Submission :submission="submission"></Submission>
    </template>
  </v-data-table>
</template>

<script>
import http from '../http';
import Submission from './Submission.vue';

export default {
  name: 'Leaderboard',

  props: {
    phaseId: String,
    user: Object,
  },

  components: {
    Submission,
  },

  data() {
    return {
      admin: false,
      submissions: [],
      loading: true,
    };
  },

  async created() {
    await this.loadData();
  },

  computed: {
    qualifiedSubmissions() {
      return this.submissions.filter(submission =>
        submission.documentationUrl &&
        submission.meta.documentationReview &&
        submission.meta.documentationReview.accepted);
    },

    submissionsCount() {
      return this.qualifiedSubmissions.length;
    },

    missingManuscriptCount() {
      return this.qualifiedSubmissions.filter(submission => !submission.documentationUrl).length;
    },

    uniqueTeamCount() {
      return new Set(this.qualifiedSubmissions.map(submission => submission.organization)).size;
    },

    usedExternalCount() {
      return this.qualifiedSubmissions.filter(submission =>
        submission.meta.usesExternalData).length;
    },

    headers() {
      return [
        {
          text: 'Rank',
          countText: `${this.submissionsCount} total`,
          value: 'rank',
        },
        {
          text: 'Team (Submitter User)',
          countText: `${this.uniqueTeamCount} unique teams`,
          value: 'organization',
        },
        {
          text: 'Approach Name',
          value: 'approach',
          sortable: false,
        },
        {
          text: 'Manuscript',
          countText: this.admin ? `${this.missingManuscriptCount} missing` : null,
          value: 'documentationUrl',
          sortable: false,
        },
        {
          text: 'Used External Data',
          countText: `${this.usedExternalCount} yes`,
          value: 'meta.usesExternalData',
        },
        {
          text: 'Primary Metric Value',
          value: 'overallScore',
        },
        ...(
          this.admin ?
            [{
              text: 'Manuscript Reviewed',
              value: 'meta.documentationReview',
              sortable: false,
            }]
            : []
        ),
      ];
    },
  },

  methods: {
    async loadData() {
      this.loading = true;

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
          submission.rank = index + 1; // eslint-disable-line no-param-reassign
        });

        this.submissions = submissionsResponse.data;
      } catch (e) {
        // TODO: Covalic may 401 here if the phase scores are hidden and the user isn't logged in
      }

      this.loading = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
th
  div
    text-align center
    width auto !important
    display inline-block
</style>
