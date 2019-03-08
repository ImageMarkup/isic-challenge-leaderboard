import Vue from 'vue';
import Vuex from 'vuex';

import http from '@/http';
import settings from '@/settings';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: {
      1: {
        id: settings.taskIds[1],
        name: 'Lesion Boundary Segmentation',
        phase: null,
        submissions: [],
        metricGroups: [
          {
            id: 'Average',
            name: 'Mean',
            primary: true,
          },
        ],
        metricTypes: [
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
          },
          {
            id: 'sensitivity',
            name: 'Sensitivity',
          },
          {
            id: 'specificity',
            name: 'Specificity',
          },
          {
            id: 'accuracy',
            name: 'Accuracy',
          },
        ],
      },
      2: {
        id: settings.taskIds[2],
        name: 'Lesion Attribute Detection',
        phase: null,
        submissions: [],
        metricGroups: [
          {
            id: 'aggregate',
            name: 'Aggregate',
            primary: true,
          },
        ],
        metricTypes: [
          {
            id: 'jaccard',
            name: 'Jaccard Index',
            primary: true,
          },
          {
            id: 'dice',
            name: 'Dice Coefficient',
          },
        ],
      },
      3: {
        id: settings.taskIds[3],
        name: 'Lesion Diagnosis',
        phase: null,
        submissions: [],
        metricGroups: [
          {
            id: 'aggregate',
            name: 'Aggregate',
            primary: true,
          },
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
            name: 'Benign keratosis (solar lentigo / seborrheic keratosis / lichen planus-like keratosis)',
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
        metricTypes: [
          {
            id: 'balanced_accuracy',
            name: 'Balanced Multiclass Accuracy',
            primary: true,
          },
          {
            id: 'accuracy',
            name: 'Accuracy',
          },
          {
            id: 'sensitivity',
            name: 'Sensitivity',
          },
          {
            id: 'specificity',
            name: 'Specificity',
          },
          {
            id: 'f1_score',
            name: 'F1 Score',
          },
          {
            id: 'ppv',
            name: 'PPV',
          },
          {
            id: 'npv',
            name: 'NPV',
          },
          {
            id: 'auc',
            name: 'Area Under ROC',
          },
          {
            id: 'auc_sens_80',
            name: 'Area Under ROC, Sensitivity > 80%',
          },
        ],
      },
    },
  },
  mutations: {
    setSubmissions(state, { taskNum, submissions }) {
      state.tasks[taskNum].submissions = submissions;
    },
    setPhase(state, { taskNum, phase }) {
      state.tasks[taskNum].phase = phase;
    },
    setScores(state, { taskNum, submissionId, scores }) {
      const submission = state.tasks[taskNum].submissions
        .find(aSubmission => aSubmission._id === submissionId);
      Vue.set(submission, 'scores', scores);
    },
  },
  actions: {
    async loadAll({ dispatch, state }) {
      const taskNums = Object.keys(state.tasks);
      const loadResults = [].concat(
        taskNums.map(taskNum => dispatch('loadSubmissions', { taskNum })),
        taskNums.map(taskNum => dispatch('loadPhase', { taskNum })),
      );
      await Promise.all(loadResults);
    },

    async loadSubmissions({ commit, state }, { taskNum }) {
      try {
        const submissionsResponse = await http.request({
          method: 'get',
          url: 'covalic_submission',
          params: {
            limit: 0,
            offset: 0,
            sort: 'overallScore',
            sortdir: -1,
            phaseId: state.tasks[taskNum].id,
          },
        });

        // Add an explicit rank to every submission (since they're sorted)
        const submissions = submissionsResponse.data.map((submission, index) => ({
          ...submission,
          rank: index + 1,
        }));

        commit('setSubmissions', { taskNum, submissions });
      } catch (e) {
        // TODO: log error
      }
    },

    async loadPhase({ commit, state }, { taskNum }) {
      try {
        const phaseResponse = await http.request({
          method: 'get',
          url: `challenge_phase/${state.tasks[taskNum].id}`,
        });

        const phase = phaseResponse.data;

        commit('setPhase', { taskNum, phase });
      } catch (e) {
        // TODO: log error
      }
    },

    async loadSubmissionDetail({ commit }, { taskNum, submissionId }) {
      try {
        const submissionResponse = await http.request({
          method: 'get',
          url: `covalic_submission/${submissionId}`,
        });

        const submission = submissionResponse.data;
        /* 'submission.score' looks like:
            [
              // scoreGroup[0]
              {
                dataset: "Average",
                metrics: [
                  {name: "threshold_jaccard", value: 0.567}
                ]
              },
              // scoreGroup[1]
              {
                dataset: "ISIC_0000001",
                metrics: [
                  {name: "threshold_jaccard", value: 0.765}
                ]
              },
              ...
            ]

           'scores' is transformed to:
            {
              "Average": {
                "threshold_jaccard": 0.567
              },
              "ISIC_0000001": {
                "threshold_jaccard": 0.765
              },
            }
         */
        const scores = submission.score
          .reduce((allScoreGroups, scoreGroup) => ({
            ...allScoreGroups,
            [scoreGroup.dataset]: scoreGroup.metrics
              .reduce((allScores, score) => ({
                ...allScores,
                [score.name]: score.value,
              }), {}),
          }), {});

        commit('setScores', { taskNum, submissionId, scores });
      } catch (e) {
        // TODO: log error
      }
    },
  },
});
