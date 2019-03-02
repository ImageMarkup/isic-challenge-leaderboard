<template>
  <v-data-table
    :headers="headers"
    :items="submissions"
    :loading="loading"
    item-key="_id"
    hide-actions
    must-sort
  >
    <template
      slot="headerCell"
      slot-scope="{ header }">
      <div>
        {{ header.text }}
        <template v-if="header.countText">
          <br>
          &lt;{{ header.countText }}&gt;
        </template>
      </div>
    </template>
    <template
      slot="items"
      slot-scope="{ item: submission, expanded }"
    >
      <Submission :submission="submission" />
    </template>
  </v-data-table>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Submission from './Submission.vue';

export default {
  name: 'Leaderboard',

  components: {
    Submission,
  },

  props: {
    taskNum: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      admin: false,
    };
  },

  computed: {
    ...mapState({
      submissions(state) {
        return state.tasks[this.taskNum].submissions;
      },
    }),

    loading() {
      return !this.submissions.length;
    },

    submissionsCount() {
      return this.submissions.length;
    },

    missingManuscriptCount() {
      return this.submissions.filter(submission => !submission.documentationUrl).length;
    },

    uniqueTeamCount() {
      return new Set(this.submissions.map(submission => submission.organization)).size;
    },

    usedExternalCount() {
      return this.submissions.filter(
        submission => submission.meta.usesExternalData,
      ).length;
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
          this.admin ? [{
            text: 'Manuscript Reviewed',
            value: 'meta.documentationReview',
            sortable: false,
          }] : []
        ),
      ];
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
