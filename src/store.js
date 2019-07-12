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
        submissions: [],
        metricGroups: [
          {
            id: 'Average',
            name: 'Macro Average',
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
        primaryMetricName: 'Balanced Multiclass Accuracy',
        submissions: [],
      },
    },
  },
  mutations: {
    setSubmissions(state, { taskNum, submissions }) {
      state.tasks[taskNum].submissions = submissions;
    },
    setScores(state, { taskNum, submissionId, scores }) {
      const submission = state.tasks[taskNum].submissions
        .find(aSubmission => aSubmission.submission_id === submissionId);
      Vue.set(submission, 'scores', scores);
    },
  },
  actions: {
    async loadAll({ dispatch, state }) {
      const taskNums = Object.keys(state.tasks);
      const loadResults = [].concat(
        taskNums.map(taskNum => dispatch('loadSubmissions', { taskNum })),
      );
      await Promise.all(loadResults);
    },

    async loadSubmissions({ commit, state }, { taskNum }) {
      try {
        const submissionsResponse = await http.request({
          method: 'get',
          url: `leaderboard/${state.tasks[taskNum].id}/by-approach`,
          params: {
            limit: 100,
            offset: 0,
          },
        });

        // Add an explicit rank to every submission (since they're sorted)
        const submissions = submissionsResponse.data.results.map((submission, index) => ({
          ...submission,
          rank: index + 1,
        }));

        commit('setSubmissions', { taskNum, submissions });
      } catch (e) {
        // TODO: log error
      }
    },

    async loadSubmissionDetail({ commit }, { taskNum, submissionId }) {
      try {
        const submissionResponse = await http.request({
          method: 'get',
          url: `submission/${submissionId}/score`,
        });

        const scores = submissionResponse.data;

        commit('setScores', { taskNum, submissionId, scores });
      } catch (e) {
        // TODO: log error
      }
    },
  },
});
