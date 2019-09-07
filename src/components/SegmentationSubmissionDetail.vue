<template>
  <v-simple-table dense>
    <!--TODO: loading text -->
    <!--TODO: primary highlight -->
    <tr>
      <InfoTh
        class="blue lighten-1 white--text"
        colspan="2"
        header
      >
        Aggregate Metrics
      </InfoTh>
      <InfoTh
        class="blue lighten-1 white--text"
        header
        tooltip="Incorporates all diagnosis categories together"
      >
        Value
      </InfoTh>
    </tr>
    <tr
      v-for="metricType in aggregateMetricTypes"
      :key="metricType.id"
    >
      <InfoTh
        :tooltip="metricType.detail"
        colspan="2">{{ metricType.name }}</InfoTh>
      <ValueTd
        :value="scoreValue('macro_average', metricType.id)"
        class="green--text text--darken-2 font-weight-bold"
      />
    </tr>
  </v-simple-table>
</template>

<script>
import SubmissionDetailMixin from './SubmissionDetailMixin';
import InfoTh from './InfoTh.vue';
import ValueTd from './ValueTd.vue';

export default {
  name: 'SegmentationSubmissionDetail',

  components: {
    InfoTh,
    ValueTd,
  },

  mixins: [SubmissionDetailMixin],

  data() {
    return {
      aggregateMetricTypes: [
        {
          id: 'threshold_jaccard',
          name: 'Threshold Jaccard Index',
          primary: true,
        },
        {
          id: 'jaccard',
          name: 'Jaccard Index',
        },
        {
          id: 'dice',
          name: 'Dice Coefficient',
          detail: 'F1 Score',
        },
        {
          id: 'accuracy',
          name: 'Accuracy',
        },
        {
          id: 'sensitivity',
          name: 'Sensitivity',
          detail: 'Recall',
        },
        {
          id: 'specificity',
          name: 'Specificity',
        },

      ],
    };
  },

  methods: {
    scoreValue(metricGroupId, metricTypeId) {
      if (this.loading) {
        // TODO: render blank while this loads
        return null;
      }
      return this.scores[metricGroupId] && this.scores[metricGroupId][metricTypeId];
    },
  },
};
</script>

<style scoped lang="stylus">
  th, td
    padding-top 12px !important
    padding-bottom 12px !important

  td
    .green--text
      background #F6FFF7
</style>
