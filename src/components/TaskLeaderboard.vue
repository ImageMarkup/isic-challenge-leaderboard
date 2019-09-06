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
      v-slot:[`header.${header.value}`]="{ header }"
      v-for="header in headers"
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
      slot-scope="{ header }">
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
          <Task3SubmissionDetail
            v-if="task.type === 'classification'"
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
// import SubmissionDetail from './SubmissionDetail.vue';
import Task3SubmissionDetail from './Task3SubmissionDetail.vue';

export default {
  name: 'TaskLeaderboard',

  components: {
    SubmissionRow,
    Task3SubmissionDetail,
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
<style lang="stylus">
table.v-table tbody td:first-child,
table.v-table tbody td:not(:first-child),
table.v-table tbody th:first-child,
table.v-table tbody th:not(:first-child),
table.v-table thead td:first-child, table.v-table thead td:not(:first-child),
table.v-table thead th:first-child, table.v-table thead th:not(:first-child)
  padding 6px 24px
</style>
