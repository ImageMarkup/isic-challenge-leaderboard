<template>
  <v-data-table
    :headers="headers"
    :items="submissions"
    :loading="loading"
    item-key="_id"
    hide-actions
    must-sort
    expand
  >
    <template
      slot="headerCell"
      slot-scope="{ header }">
      <div>
        {{ header.text }}
        <template v-if="header.subText">
          <br>
          &lt;{{ header.subText }}&gt;
        </template>
      </div>
    </template>
    <template
      slot="items"
      slot-scope="props"
    >
      <Submission
        :submission="props.item"
        :expanded="props.expanded || false"
        @click.native="toggleExpand(props)"
      />
    </template>
    <template
      slot="expand"
      slot-scope="{ item: submission }">
      <component
        :is="detailComponent"
        :task-num="taskNum"
        :submission="submission"
      />
    </template>
  </v-data-table>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Submission from './Submission.vue';
import SubmissionDetail from './SubmissionDetail.vue';
import Task3SubmissionDetail from './Task3SubmissionDetail.vue';

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
      primaryMetricName(state) {
        return state.tasks[this.taskNum].primaryMetricName
          || state.tasks[this.taskNum].metricTypes
            .find(metricGroup => metricGroup.primary)
            .name;
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
          subText: `${this.submissionsCount} total`,
          value: 'rank',
        },
        {
          text: 'Team (Submitter User)',
          subText: `${this.uniqueTeamCount} unique teams`,
          value: 'organization',
        },
        {
          text: 'Approach Name',
          value: 'approach',
          sortable: false,
        },
        {
          text: 'Manuscript',
          subText: this.admin ? `${this.missingManuscriptCount} missing` : null,
          value: 'documentationUrl',
          sortable: false,
        },
        {
          text: 'Used External Data',
          subText: `${this.usedExternalCount} yes`,
          value: 'meta.usesExternalData',
        },
        {
          text: 'Primary Metric Value',
          subText: this.primaryMetricName,
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
    detailComponent() {
      return {
        1: SubmissionDetail,
        2: SubmissionDetail,
        3: Task3SubmissionDetail,
      }[this.taskNum];
    },
  },
  methods: {
    ...mapActions([
      'loadSubmissionDetail',
    ]),
    toggleExpand(props) {
      // eslint-disable-next-line no-param-reassign
      props.expanded = !props.expanded;
      if (props.expanded) {
        const submission = props.item;
        this.loadSubmissionDetail({ taskNum: this.taskNum, submissionId: submission._id });
      }
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
