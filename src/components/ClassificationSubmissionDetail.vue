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
      v-for="metric in aggregateMetrics"
      :key="metric.id"
    >
      <InfoTh
        :tooltip="metric.detail"
        colspan="2"
      >
        {{ metric.name }}
      </InfoTh>
      <ValueTd
        :value="loading ? null : scores.aggregate[metric.id]"
        class="green--text text--darken-2 font-weight-bold"
      />
    </tr>
    <tr class="spacer" />
    <tr>
      <th
        class="blue lighten-1 white--text"
        rowspan="2"
        colspan="2"
      >
        Category Metrics
      </th>
      <InfoTh
        class="blue lighten-1 white--text"
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
        class="blue darken-2 white--text"
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
      v-for="metric in integralMetrics"
      :key="metric.id"
    >
      <InfoTh :tooltip="metric.detail">
        {{ metric.name }}
      </InfoTh>
      <ValueTd
        :value="loading ? null : scores.macro_average[metric.id]"
        class="green--text text--darken-2 font-weight-bold"
      />
      <ValueTd
        v-for="category in categories"
        :key="category.id"
        :value="loading ? null : scores.per_category[metric.id][category.id]"
      />
    </tr>

    <tr class="rotated-header">
      <InfoTh
        class="grey darken-3 white--text rotate-text"
        header
        rowspan="7"
        tooltip="Evaluated using a prediction threshold of 0.5"
      >
        Threshold Metrics
      </InfoTh>
    </tr>
    <tr
      v-for="metric in thresholdMetrics"
      :key="metric.id"
    >
      <InfoTh :tooltip="metric.detail">
        {{ metric.name }}
      </InfoTh>
      <ValueTd
        :value="loading ? null : scores.macro_average[metric.id]"
        class="green--text text--darken-2 font-weight-bold"
      />
      <ValueTd
        v-for="category in categories"
        :key="category.id"
        :value="loading ? null : scores.per_category[metric.id][category.id]"
      />
    </tr>
  </v-simple-table>
</template>

<script>
import SubmissionDetailMixin from './SubmissionDetailMixin';
import InfoTh from './InfoTh.vue';
import ValueTd from './ValueTd.vue';

export default {
  name: 'ClassificationSubmissionDetail',

  components: {
    InfoTh,
    ValueTd,
  },

  mixins: [SubmissionDetailMixin],

  data() {
    return {
      aggregateMetrics: [
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
      integralMetrics: [
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
      thresholdMetrics: [
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
    categories() {
      if (this.loading) {
        return [];
      }
      // Accuracy can be a representative for all per-category metrics
      const usedCategoryIds = Object.keys(this.scores.per_category.accuracy);
      return this.possibleCategories.filter(
        category => usedCategoryIds.includes(category.id),
      );
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

  tr.spacer
    height 35px
    opacity 0

  .rotated-header
    height 0 !important
    margin 0 !important
    padding 0 !important

    i
      color white
      transform rotate(180deg)

  .rotate-text
    white-space nowrap
    writing-mode sideways-lr
</style>
