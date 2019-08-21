<template>
  <table
    class="metrics-table"
    cellspacing="1"
    width="100%"
  >
    <!--TODO: loading text -->
    <!--TODO: primary highlight -->
    <tr>
      <InfoTh
        addclass="transparent"
        header
      />
      <InfoTh
        addclass="blue lighten-1 white--text"
        header
      >
        Aggregate Metrics
      </InfoTh>
      <InfoTh
        addclass="blue lighten-1 white--text"
        header
        tooltip="Incorporates all diagnosis categories together"
      >
        Value
      </InfoTh>
    </tr>
    <tr
      v-for="metricType in aggregateMetricTypes"
      :key="metricType.id"
      class="aggregate"
    >
      <InfoTh addclass="transparent" />
      <InfoTh :tooltip="metricType.detail">{{ metricType.name }}</InfoTh>
      <ValueTd
        :value="scoreValue('aggregate', metricType.id)"
      />
    </tr>

    <tr>
      <th
        class="transparent"
        rowspan="2"
      />
      <th
        class="blue lighten-1 white--text"
        rowspan="2"
      >
        Category Metrics
      </th>
      <InfoTh
        addclass="blue lighten-1 white--text"
        header
        tooltip="The arithmetic mean (macro averaging) of values from all diagnosis categories"
        rowspan="2"
      >
        Mean Value
      </InfoTh>
      <th
        :colspan="categories.length"
        class="blue lighten-1 white--text"
      >
        Diagnosis Category
      </th>
    </tr>
    <tr>
      <InfoTh
        v-for="category in categories"
        :key="category.id"
        :tooltip="category.name"
        addclass="blue darken-2 white--text"
        header
      >
        {{ category.id }}
      </InfoTh>
    </tr>

    <tr class="rotated-header">
      <th
        class="grey darken-3 white--text rotate-text"
        header
        rowspan="4"
      >
        Integral Metrics
      </th>
    </tr>
    <tr
      v-for="metricType in integralMetricTypes"
      :key="metricType.id"
      class="integral"
    >
      <InfoTh :tooltip="metricType.detail">{{ metricType.name }}</InfoTh>
      <ValueTd
        :value="scoreValue('macro_average', metricType.id)"
      />
      <ValueTd
        v-for="category in categories"
        :key="category.id"
        :value="scoreValue(category.id, metricType.id)"
      />
    </tr>

    <tr class="rotated-header">
      <InfoTh
        addclass="grey darken-3 white--text rotate-text"
        header
        rowspan="7"
        tooltip="Evaluated using a prediction threshold of 0.5"
      >
        Threshold Metrics
      </InfoTh>
    </tr>
    <tr
      v-for="metricType in thresholdMetricTypes"
      :key="metricType.id"
      class="threshold"
    >
      <InfoTh :tooltip="metricType.detail">{{ metricType.name }}</InfoTh>
      <ValueTd
        :value="scoreValue('macro_average', metricType.id)"
      />
      <ValueTd
        v-for="category in categories"
        :key="category.id"
        :value="scoreValue(category.id, metricType.id)"
      />
    </tr>


  </table>
</template>

<script>
import InfoTh from '@/components/InfoTh.vue';
import ValueTd from '@/components/ValueTd.vue';

export default {
  name: 'Task3SubmissionDetail',

  components: {
    InfoTh,
    ValueTd,
  },

  props: {
    submission: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      aggregateMetricTypes: [
        {
          id: 'balanced_accuracy',
          name: 'Balanced Multiclass Accuracy',
          detail: 'The greatest diagnosis category score determines the category prediction for '
            + 'each image; the mean recall of this multiclass confusion matrix (i.e. the mean of '
            + 'the diagonal element-wise divided by the positive incidences) is the balanced '
            + 'multiclass accuracy',
          primary: true,
        },
      ],
      integralMetricTypes: [
        {
          id: 'auc',
          name: 'AUC',
          detail: 'Area under the receiver operating characteristic (ROC) curve',
        },
        {
          id: 'auc_sens_80',
          name: 'AUC, Sens > 80%',
          detail: 'Area under the receiver operating characteristic (ROC) curve, evaluated only '
            + 'for the region where sensitivity > 80%',
        },
        {
          id: 'ap',
          name: 'Average Precision',
          detail: 'Area under the interpolated precision-recall (PR) curve',
        },
      ],
      thresholdMetricTypes: [
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
        {
          id: 'dice',
          name: 'Dice Coefficient',
          detail: 'F1 Score',
        },
        {
          id: 'ppv',
          name: 'PPV',
          detail: 'Positive Predictive Value / Precision',
        },
        {
          id: 'npv',
          name: 'NPV',
          detail: 'Negative Predictive Value',
        },
      ],
      possibleCategories: [
        {
          id: 'MEL',
          name: 'Melanoma',
        },
        {
          id: 'NV',
          name: 'Melanocytic nevus',
        },
        {
          id: 'BCC',
          name: 'Basal cell carcinoma',
        },
        {
          id: 'AK',
          name: 'Actinic keratosis',
        },
        {
          id: 'AKIEC',
          name: 'Actinic keratosis / Bowen’s disease (intraepithelial carcinoma)',
        },
        {
          id: 'BKL',
          name: 'Benign keratosis (solar lentigo / seborrheic keratosis / '
            + 'lichen planus-like keratosis)',
        },
        {
          id: 'DF',
          name: 'Dermatofibroma',
        },
        {
          id: 'VASC',
          name: 'Vascular lesion',
        },
        {
          id: 'SCC',
          name: 'Squamous cell carcinoma',
        },
        {
          id: 'UNK',
          name: 'None of the others / out of distribution',
        },
      ],
    };
  },

  computed: {
    loading() {
      return !this.submission.scores;
    },
    categories() {
      if (this.loading) {
        return [];
      }
      return this.possibleCategories.filter(
        category => Object.keys(this.submission.scores).includes(category.id),
      );
    },
  },
  methods: {
    scoreValue(metricGroupId, metricTypeId) {
      if (this.loading) {
        // TODO: render blank while this loads
        return null;
      }
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
    background white
  .aggregate td:nth-child(3),
  .integral td:nth-child(2),
  .threshold td:nth-child(2)
    background #F6FFF7
    color #388E3C
    font-weight 600
  .rotated-header
    height 0 !important
    margin 0 !important
    padding 0 !important
  .rotated-header i
    color white
    transform rotate(180deg)
  .rotate-text
    white-space nowrap
    writing-mode sideways-lr
</style>
