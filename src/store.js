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
        primaryMetricName: 'Balanced Multiclass Accuracy',
        submissions: [],
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
