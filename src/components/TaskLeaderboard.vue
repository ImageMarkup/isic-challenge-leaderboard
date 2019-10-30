<template>
  <v-data-table
    :headers="headers"
    :items="submissions"
    :loading="loading"
    item-key="submission_id"
    hide-default-footer
    must-sort
  >
    <template
      v-for="header in headers"
      v-slot:[`header.${header.value}`]="{ header }"
    >
      <div :key="header.value">
        {{ header.text }}
        <template v-if="header.subText">
          <br>
          &lt;{{ header.subText }}&gt;
        </template>
      </div>
    </template>

    <template
      slot="headerCell"
      slot-scope="{ header }"
    >
      <div>
        {{ header.text }}
        <template v-if="header.subText">
          <br>
          &lt;{{ header.subText }}&gt;
        </template>
      </div>
    </template>
    <template #item="{ item: submission, isExpanded, expand }">
      <SubmissionRow
        :submission="submission"
        :expanded="isExpanded"
        @click.native="expand(!isExpanded)"
      />
    </template>
    <template #expanded-item="{ item: submission, headers }">
      <td
        :colspan="headers.length"
        class="grey lighten-3 inset-shadow"
      >
        <v-container fluid>
          <SegmentationSubmissionDetail
            v-if="task.type === 'segmentation'"
            :submission="submission"
          />
          <ClassificationSubmissionDetail
            v-else-if="task.type === 'classification'"
            :submission="submission"
          />
        </v-container>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';
import SubmissionRow from './SubmissionRow.vue';
import SegmentationSubmissionDetail from './SegmentationSubmissionDetail.vue';
import ClassificationSubmissionDetail from './ClassificationSubmissionDetail.vue';

export default {
  name: 'TaskLeaderboard',

  components: {
    SubmissionRow,
    SegmentationSubmissionDetail,
    ClassificationSubmissionDetail,
  },

  props: {
    taskId: {
      type: Number,
      required: true,
    },
    byTeam: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    ...mapGetters('leaderboard', [
      'getTaskById',
    ]),
    task() {
      return this.getTaskById(this.taskId);
    },
    submissions() {
      return this.byTeam ? this.task.submissionsByTeam : this.task.submissions;
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
        {
          text: '', // details
          value: null,
          sortable: false,
        },
      ];
    },
  },
};
</script>

<style scoped lang="stylus">
  .v-data-table
    td,th
      padding 6px 24px

    th
      div
        text-align center
        width auto !important
        display inline-block

  .inset-shadow
    box-shadow inset 0 0 15px rgba(0, 0, 0, .15)
</style>
