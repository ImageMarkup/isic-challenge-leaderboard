<template>
  <div class="container fluid">
    <v-layout
      row
      wrap
    >
      <v-flex
        px-4
        xs4
      >
        <table>
          <!--TODO: loading text -->
          <!--TODO: primary highlight -->
          <tr>
            <InfoTh header>Aggregate Metrics</InfoTh>
            <InfoTh
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
            <InfoTh :tooltip="metricType.detail">{{ metricType.name }}</InfoTh>
            <ValueTd
              :value="scoreValue('aggregate', metricType.id)"
            />
          </tr>
        </table>
      </v-flex>
      <v-spacer />
      <v-flex
        px-4
        xs8
      >
        <table>
          <tr>
            <th rowspan="2">Category Metrics</th>
            <InfoTh
              header
              tooltip="The arithmetic mean (macro averaging) of values from all diagnosis categories
              "
              rowspan="2"
            >
              Mean Value
            </InfoTh>
            <th
              :colspan="categories.length"
              class="diagnosis-header"
            >
              Diagnosis Category
            </th>
          </tr>
          <tr class="diagnosis-categories">
            <InfoTh
              v-for="category in categories"
              :key="category.id"
              :tooltip="category.name"
              header
            >
              {{ category.id }}
            </InfoTh>
          </tr>

          <tr class="table-sub-head">
            <th
              colspan="9"
              header
            >
              <div>
                Integral Metrics
              </div>
            </th>
          </tr>
          <tr
            v-for="metricType in integralMetricTypes"
            :key="metricType.id"
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

          <tr class="table-sub-head">
            <InfoTh
              colspan="9"
              header
              tooltip="Evaluated using a prediction threshold of 0.5"
            >
              <div>
                Threshold Metrics
              </div>
            </InfoTh>
          </tr>
          <tr
            v-for="metricType in thresholdMetricTypes"
            :key="metricType.id"
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
      </v-flex>
    </v-layout>
  </div>
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
    taskNum: {
      type: String,
      required: true,
    },
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
      categories: [
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
      ],
    };
  },

  computed: {
    loading() {
      return !this.submission.scores;
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
  .container
    background #e8e8e8
    padding-bottom 45px
  .bold
    color #fff !important
    font-weight bold
  table
    background #ffffff
    border-radius 3px
    box-shadow 0 2px 5px rgba(0, 0, 0, .12)
    width 100%
  th
    background #efefef
    text-align left
  tr, th, td
    height 35px !important
  th, td
    &:first-child
      border-right 1px solid rgba(255, 255, 255, 0.12)
  .diagnosis-header
    background #0d47a1
    color #ffffff
    text-align center
  .diagnosis-categories
    th
      background #E3F2FD
      color #0d47a1
  .table-sub-head
    th
      background #ffffff
      div
        color #757575
        border-bottom 1px solid #e8e8e8
        font-size 11px
        padding 10px 0 5px
</style>
