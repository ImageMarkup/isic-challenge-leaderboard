<template>
  <v-data-table
    :headers="headers"
    :items="values"
    :loading="loading"
    no-data-text="Loading..."
    item-key="name"
    hide-default-footer
    dark
  >
    <template
      slot="headers"
      slot-scope="{ headers }">
      <tr>
        <th
          v-for="header in headers"
          :key="header.value"
          class="column text-left"
        >
          {{ header.text }}
        </th>
      </tr>
    </template>
    <template
      slot="items"
      slot-scope="{ item: metricGroup }"
    >
      <td>{{ metricGroup.name }}</td>
      <td
        v-for="metricType in metricTypes"
        :key="metricType.id"
        :class="{bold: metricGroup.primary && metricType.primary}"
      >
        <template v-if="scoreValue(metricGroup.id, metricType.id) !== undefined">
          <v-tooltip bottom>
            <span slot="activator">
              {{ scoreValue(metricGroup.id, metricType.id).toPrecision(3) }}
            </span>
            <span>
              {{ scoreValue(metricGroup.id, metricType.id) }}
            </span>
          </v-tooltip>
        </template>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SubmissionDetail',

  props: {
    taskNum: {
      type: String,
      required: true,
    },
    submission: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapState({
      metricTypes(state) {
        return state.tasks[this.taskNum].metricTypes;
      },
      metricGroups(state) {
        return state.tasks[this.taskNum].metricGroups;
      },
    }),
    loading() {
      return !this.submission.scores;
    },
    headers() {
      return [].concat(
        // Add a fake metric type to hold the group info
        [{
          name: '',
          id: null,
        }],
        this.metricTypes,
      )
        .map(metric => ({
          text: metric.name,
          value: metric.id,
          sortable: false,
          primary: metric.primary,
        }));
    },
    values() {
      if (this.loading) {
        return [];
      }
      return this.metricGroups;
    },
  },
  methods: {
    scoreValue(metricGroupId, metricTypeId) {
      return this.submission.scores[metricGroupId]
        && this.submission.scores[metricGroupId][metricTypeId];
    },
  },
};
</script>

<style scoped lang="stylus">
  .bold
    color #fff !important
    font-weight bold
  tr, th, td
    height 35px !important
  th, td
    &:first-child
      border-right 1px solid rgba(255, 255, 255, 0.12)
</style>
