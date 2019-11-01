<template>
  <div />
</template>
<script>
import Plotly from 'plotly.js-basic-dist';
import sortBy from 'lodash/sortBy';

export default {
  name: 'ClassificationRocPlot',

  props: {
    approachName: {
      type: String,
      required: true,
    },
    rocs: {
      type: Object,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
  },

  computed: {
    rocData() {
      return this.categories.map((category) => {
        let roc = this.rocs[category.id];

        roc = sortBy(
          Object.entries(roc)
            .map(([threshold, points]) => ({
              ...points,
              threshold: parseFloat(threshold),
            })),
          point => point.threshold,
        );

        const fprs = roc.map(point => point.fpr);
        const tprs = roc.map(point => point.tpr);
        const thresholds = roc.map(point => point.threshold);

        return {
          name: category.id,
          x: fprs,
          y: tprs,
          text: thresholds,
          hovertemplate: 'FPR: %{x:.1%}<br>TPR: %{y:.1%}<br>Threshold: %{text:.3f}',
          type: 'scatter',
          mode: 'lines',
        };
      });
    },
    data() {
      return [
        ...this.rocData,
        {
          type: 'scatter',
          mode: 'lines',
          x: [0, 1],
          y: [0, 1],
          showlegend: false,
          hoverinfo: 'skip',
          opacity: 0.2,
          line: {
            color: 'black',
            width: 1,
            dash: 'longdash',
          },
        },
      ];
    },
    wrappedApproachName() {
      // https://stackoverflow.com/a/51506718
      return this.approachName.replace(/(?!.{1,60}$)(.{1,60})\s/g, '$1<br>');
    },
    layout() {
      return {
        title: {
          text: `<b>ROC</b><br>${this.wrappedApproachName}`,
          y: 0.97,
          yanchor: 'top',
          font: {
            size: 14,
          },
        },

        width: 500,
        height: 500,
        margin: {
          l: 60,
          r: 20,
          t: 70,
          b: 65,
          autoexpand: false,
        },

        xaxis: {
          title: 'FPR',
          range: [0, 1],
          fixedrange: true, // disable zoom
        },
        yaxis: {
          title: 'TPR',
          range: [0, 1],
          fixedrange: true,
        },

        showlegend: true,
        legend: {
          x: 1,
          xanchor: 'right',
          y: 0.1,
          yanchor: 'bottom',
        },
        annotations: [
          {
            showarrow: false,
            text: '<i>Click to toggle</i>',
            font: {
              size: 8,
            },
            x: 0.98,
            xref: 'paper',
            xanchor: 'right',
            y: 0.07,
            yref: 'paper',
          },
        ],

        hovermode: 'closest',
        hoverdistance: 2, // require pointer to be close to point before showing tooltip

        dragmode: false, // disable dragging
      };
    },
    config() {
      return {
        displaylogo: false,
        modeBarButtonsToRemove: [
          'toggleSpikelines',
          'hoverClosestCartesian',
          'hoverCompareCartesian',
        ],
      };
    },
  },
  watch: {
    approachName() {
      this.react();
    },
    rocs() {
      this.react();
    },
    categories() {
      this.react();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      return Plotly.newPlot(this.$el, this.data, this.layout, this.config);
    },
    react() {
      return Plotly.react(this.$el, this.data, this.layout, this.config);
    },
  },
};
</script>

<style scoped lang="stylus">
  /deep/ .svg-container
    margin-left auto !important
    margin-right auto !important
</style>
