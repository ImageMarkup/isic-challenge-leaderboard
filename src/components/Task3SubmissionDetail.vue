<template>
  <v-app>
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

    <tr>
      <th rowspan="2">Category Metrics</th>
      <InfoTh
        header
        tooltip="The arithmetic mean (macro averaging) of values from all diagnosis categories"
        rowspan="2"
      >
        Mean Value
      </InfoTh>
      <th :colspan="categories.length">Diagnosis Category</th>
    </tr>
    <tr>
      <InfoTh
        v-for="category in categories"
        :key="category.id"
        :tooltip="category.name"
        header
      >
        {{ category.id }}
      </InfoTh>
    </tr>

    <tr>
      <th header>Integral Metrics</th>
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

    <tr>
      <InfoTh
        header
        tooltip="Evaluated using a prediction threshold of 0.5"
      >
        Threshold Metrics
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
  <v-flex 
    class="text-xs-center"
  >
    <v-btn-toggle 
      v-model="toggle" 
      @change="loadROC"
      mandatory
      multiple
      class="my-3"
    >
      <v-btn 
        flat
        v-for="category in categories"
        :key="category.id"
      >
        {{ category.id }}
      </v-btn>
      <v-btn
        flat
      >
        CLEAR
      </v-btn>
    </v-btn-toggle>
  </v-flex>
  <v-layout
    align-center
    row
  >
    <vue-plotly
      v-if="plots[0]"
      id="roc_plot0"
      :data="data[0]"
      :layout="layout[0]"
      :options="options"
      v-on:click="annotate(0)($event)"
    />
    <v-spacer/>
    <vue-plotly
      v-if="plots[1]"
      id="roc_plot1"
      :data="data[1]"
      :layout="layout[1]"
      :options="options"
      v-on:click="annotate(1)($event)"
    />
  </v-layout>
  </v-app>
</template>

<script>
import InfoTh from '@/components/InfoTh.vue';
import ValueTd from '@/components/ValueTd.vue';
import VuePlotly from '@statnett/vue-plotly';

export default {
  name: 'Task3SubmissionDetail',

  components: {
    InfoTh,
    ValueTd,
    VuePlotly
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
      data: {
        0: [],
        1: [],
      },
      layout: [
        {
          xaxis: {
            title: {
              text: 'FPR'
            },
            range: [ 0, 1 ],
            dtick: .2,
          },
          yaxis: {
            title: {
              text: 'TPR'
            },
            range: [ 0, 1 ],
            dtick: .2,
          },
          hovermode: 'closest',
          annotations: [],
          width: 500,
          height: 500,
          title: 'ROC',
        },
        {
          xaxis: {
            title: {
              text: 'FPR'
            },
            range: [ 0, 1 ],
            dtick: .2,
          },
          yaxis: {
            title: {
              text: 'TPR'
            },
            range: [ 0, 1 ],
            dtick: .2,
          },
          hovermode: 'closest',
          annotations: [],
          width: 500,
          height: 500,
          title: 'ROC',
        }
      ],
      options: {
        displayModeBar: false,
        responsive: true
      },
      fprs: [[], []],
      tprs: [[], []],
      thresholds: [[], []],
      plots: [false,false],
      sampledata: require('./full_roc.json'),
      toggle: [0],
      clear: 0,
    };
  },
  created(){
    this.clear = this.categories.length;
    this.toggle = [this.clear];
  },
  computed: {
    loading() {
      return !this.submission.scores;
    },
  },
  methods: {
    scoreValue(metricGroupId, metricTypeId) {
      if (this.loading){
        // TODO: render blank while this loads
        return null;
      }
      return this.submission.scores[metricGroupId]
        && this.submission.scores[metricGroupId][metricTypeId];
    },
    viewport() {
      var e = window;
      var a = 'inner';
      if (!('innerWidth' in window)){
        a = 'client';
        e = document.documentElement || document.body;
      }
      return { width : e[ a+'Width' ], height : e[ a+'Height' ]};
    },
    hideROC(){
      this.toggle = [this.clear];
      this.plots = [false, false];
    },
    replot(){
      let temp = this.toggle.concat().sort();
      this.plots = [true, false];
      const cat1 = this.categories[temp[0]].id;

      // in case plot 1 shifts to plot 2
      const old_data = this.data[0].concat();
      const old_thresholds = this.thresholds[0].concat();
      const old_annotations = this.layout[0].annotations.concat();
      const old_title = this.layout[0].title;
      if (`${cat1} ROC` !== this.layout[0].title && `${cat1} ROC` === this.layout[1].title) { // shift plot 2 to 1
        this.data[0] = this.data[1];
        this.fprs[0] = this.fprs[1];
        this.tprs[0] = this.tprs[1];
        this.thresholds[0] = this.thresholds[1];
        this.layout[0].annotations = this.layout[1].annotations.concat();
        this.layout[0].title = `${cat1} ROC`;
        if (this.layout[0].annotations.length > 0){
          this.auc();
        }
      } else if (`${cat1} ROC` !== this.layout[0].title && `${cat1} ROC` !== this.layout[1].title) { // new plot 1
        this.fprs[0] = this.sampledata.map(datapoint => datapoint.fpr);
        this.tprs[0] = this.sampledata.map(datapoint => datapoint.tpr);
        this.thresholds[0] = this.sampledata.map(datapoint => datapoint.threshold);
        this.layout[0].annotations = [];
        this.layout[0].title = `${cat1} ROC`;
        const labels = this.sampledata.map(datapoint =>
          `<b>FPR:</b> ${datapoint.fpr.toPrecision(4)} <br>` +
          `<b>TPR:</b> ${datapoint.tpr.toPrecision(4)} <br>` +
          `<b>Threshold:</b> ${datapoint.threshold.toPrecision(4)}`);
        this.data[0] = [{
          x: this.fprs[0],
          y: this.tprs[0],
          text: labels,
          name: `${cat1} ROC`,
          mode: 'lines',
          line: {
            color: 'rgb(55, 128, 191)'
          },
          type: 'scatter',
          hoverinfo: 'text',
        }];
      }

      if (this.toggle.length == 2){
        this.plots[1] = true;
        const cat2 = this.categories[temp[1]].id;
        if (`${cat2} ROC` === old_title) { // shift plot 1 to 2
          this.data[1] = old_data;
          this.fprs[1] = old_data.x;
          this.tprs[1] = old_data.y;
          this.thresholds[1] = old_thresholds;
          this.layout[1].annotations = old_annotations.concat();
          this.layout[1].title = `${cat2} ROC`;
          if (this.layout[1].annotations.length > 0){
            this.auc(1);
          }
        } else if (`${cat2} ROC` !== this.layout[1].title) { // new plot 2
          this.fprs[1] = this.sampledata.map(datapoint => datapoint.fpr);
          this.tprs[1] = this.sampledata.map(datapoint => datapoint.tpr);
          this.thresholds[1] = this.sampledata.map(datapoint => datapoint.threshold);
          this.layout[1].annotations = [];
          this.layout[1].title = `${cat2} ROC`;
          const labels = this.sampledata.map(datapoint =>
            `<b>FPR:</b> ${datapoint.fpr.toPrecision(4)} <br>` +
            `<b>TPR:</b> ${datapoint.tpr.toPrecision(4)} <br>` +
            `<b>Threshold:</b> ${datapoint.threshold.toPrecision(4)}`);
          this.data[1] = [{
            x: this.fprs[1],
            y: this.tprs[1],
            text: labels,
            name: `${cat2} ROC`,
            mode: 'lines',
            line: {
              color: 'rgb(55, 128, 191)'
            },
            type: 'scatter',
            hoverinfo: 'text',
          }];
        }      
      }
    },
    loadROC(toggle){
      const clicked = toggle.pop();
      if (clicked == this.clear) {
        toggle.push(this.clear);
        this.hideROC();
      } else {
        toggle.push(clicked);
        const clearedIdx = toggle.indexOf(this.clear);
        if (clearedIdx !== -1) {
          toggle.splice(clearedIdx, 1);
        }
        if (toggle.length > 2) {
          const add = toggle.pop();
          const removed = toggle.shift();
          this.replot();
          toggle.push(add);
        }
        this.replot();
      }

      const dimension = this.viewport();
      const square = Math.min(dimension.width/2, dimension.height);
      this.layout[0].width = square;
      this.layout[0].height = square;
      this.layout[1].width = square;
      this.layout[1].height = square;
    },
    annotate (plot) {
      let thresholds = this.thresholds[plot];
      let layout = this.layout[plot];
      const auc = this.auc(plot);
      const closeAnnotation = this.closeAnnotation(plot);
      return function (data) {
        const point = data.points[0];
        const newAnnotation = {
          x: point.xaxis.d2l(point.x),
          y: point.yaxis.d2l(point.y),
          arrowhead: 7,
          ax: 0,
          ay: -80,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          font: {size: 12},
          bordercolor: 'rgba(100, 100, 200, 0.7)',
          borderwidth: 2,
          borderpad: 4,
          captureevents: true,
          text:
            `<b>FPR</b> ${((point.x).toPrecision(4))}<br>` +
            `<b>TPR</b> ${((point.y).toPrecision(4))}<br>` +
            `<b>Threshold</b> ${(thresholds[point.pointNumber].toPrecision(4))}`,
        };
        const repeatIdx = layout.annotations.reduce((acc, curr, idx) =>
          (curr.x == newAnnotation.x && curr.y == newAnnotation.y) ? idx : acc,
          -1
        );
        layout.annotations.push(newAnnotation);
        auc();
        document.getElementById(`roc_plot${plot}`).on('plotly_clickannotation', closeAnnotation);
      }
    },
    closeAnnotation (plot) {
      let layout = this.layout[plot];
      const auc = this.auc(plot);
      return function(data) {
        const index = this.layout[plot].annotations.reduce((acc, curr, idx) =>
          (curr.x == data.annotation.x && curr.y == data.annotation.y) ? idx : acc,
          -1
        );
        if (index > -1) {
          layout[plot].annotations.splice(index, 1);
          auc(plot);
        }
      }
    },
    auc (plot) {
      let data = this.data[plot];
      let layout = this.layout[plot];
      const fprs = this.fprs[plot];
      const tprs = this.tprs[plot];
      const integrate = this.integrate;

      return function () {
        const roc = data.pop();
        data.length = 0;
        let indices = layout.annotations.map((curr) => {
          const fprIdx = fprs.indexOf(curr.x);
          const tprIdx = tprs.indexOf(curr.y);
          return Math.max(fprIdx, tprIdx);
        });
        indices = indices.sort((a, b) => a - b);
        for (let i = 0; i < indices.length; i++){
          let auc = {
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
          };
          if (i == 0) {
            auc.x = fprs.slice(0, indices[i] + 1);
            auc.y = tprs.slice(0, indices[i] + 1);
          } else {
            auc.x = fprs.slice(indices[i - 1], indices[i]  + 1);
            auc.x = tprs.slice(indices[i - 1], indices[i]  + 1);
          }
          auc.name = `Area ${i + 1}: ${integrate(auc)}`;
          data.push(auc);
        };
        data.push(roc);
      }
    },
    integrate (auc) {
      let sum = 0;
      for (let i = 2; i < auc.x.length; i += 2) {
        const rect = (auc.x[i] - auc.x[i - 2]) * auc.y[i - 1];
        sum += rect;
      }
      return sum.toPrecision(4);
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
