import Vue from 'vue';
import Vuex from 'vuex';

import http from '@/http';
import settings from '@/settings';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    challenge: {
      name: '',
    },
    tasks: {},

    /*
    oldTasks: {
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
    */
  },
  getters: {
    getTaskById: state => (taskId) => {
      return state.tasks.find(aTask => aTask.id === taskId);
    },
  },
  mutations: {
    resetChallenge(state) {
      state.challenge.name = settings.name;
      state.tasks = settings.tasks.map((task => ({
        ...task,
        submissions: [],
      })));
    },
    setSubmissions(state, { taskId, submissions }) {
      const task = state.tasks.find(aTask => aTask.id === taskId);
      Vue.set(task, 'submissions', submissions);
    },
    setScores(state, { taskId, submissionId, scores }) {
      const task = state.tasks.find(aTask => aTask.id === taskId);
      const submission = task.submissions
        .find(aSubmission => aSubmission.submission_id === submissionId);
      Vue.set(submission, 'scores', scores);
    },
  },
  actions: {
    async loadAll({ commit, dispatch, state }) {
      commit('resetChallenge');

      const loadResults = [].concat(
        state.tasks.map(task => dispatch('loadSubmissions', { taskId: task.id })),
      );
      await Promise.all(loadResults);
    },

    async loadSubmissions({ commit }, { taskId }) {
      try {
        const submissionsResponse = await http.request({
          method: 'get',
          url: `leaderboard/${taskId}/by-approach`,
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

        commit('setSubmissions', { taskId, submissions });
      } catch (e) {
        // TODO: log error
      }
    },

    async loadSubmissionDetail({ commit }, { taskId, submissionId }) {
      try {
        const submissionResponse = await http.request({
          method: 'get',
          url: `submission/${submissionId}/score`,
        });

        const scores = submissionResponse.data;

        commit('setScores', { taskId, submissionId, scores });
      } catch (e) {
        // TODO: log error
      }
    },
  },
});
