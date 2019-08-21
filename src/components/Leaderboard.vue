<template>
  <v-data-table
    :headers="headers"
    :items="submissions"
    :loading="loading"
    item-key="submission_id"
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
      <v-container
        class="grey lighten-3 inset-shadow"
        fluid
      >
        <Task3SubmissionDetail
          v-if="task.type === 'classification'"
          :submission="submission"
        />
      </v-container>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Submission from './Submission.vue';
// import SubmissionDetail from './SubmissionDetail.vue';
import Task3SubmissionDetail from './Task3SubmissionDetail.vue';

export default {
  name: 'Leaderboard',

  components: {
    Submission,
    Task3SubmissionDetail,
  },

  props: {
    taskId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      admin: false,
    };
  },

  computed: {
    ...mapGetters([
      'getTaskById',
    ]),
    task() {
      return this.getTaskById(this.taskId);
    },
    submissions() {
      return this.task.submissions;
    },

    loading() {
      return !this.submissions.length;
    },

    submissionsCount() {
      return this.submissions.length;
    },

    missingManuscriptCount() {
      return this.submissions.filter(submission => !submission.approach_manuscript_url).length;
    },

    uniqueTeamCount() {
      return new Set(this.submissions.map(submission => submission.team_name)).size;
    },

    usedExternalCount() {
      return this.submissions.filter(
        submission => submission.approach_uses_external_data,
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
          text: 'Team',
          subText: `${this.uniqueTeamCount} unique teams`,
          value: 'team_name',
        },
        {
          text: 'Approach Name',
          value: 'approach_name ',
          sortable: false,
        },
        {
          text: 'Manuscript',
          subText: this.admin ? `${this.missingManuscriptCount} missing` : null,
          value: 'approach_manuscript_url',
          sortable: false,
        },
        {
          text: 'Used External Data',
          subText: `${this.usedExternalCount} yes`,
          value: 'approach_uses_external_data',
        },
        {
          text: 'Primary Metric Value',
          subText: this.task.primaryMetricName,
          value: 'overall_score',
        },
        // ...(
        //   this.admin ? [{
        //     text: 'Manuscript Reviewed',
        //     value: 'meta.documentationReview',
        //     sortable: false,
        //   }] : []
        // ),
      ];
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
        this.loadSubmissionDetail({ taskId: this.taskId, submissionId: submission.submission_id });
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
.inset-shadow
  box-shadow inset 0 0 15px rgba(0, 0, 0, .15)
</style>
