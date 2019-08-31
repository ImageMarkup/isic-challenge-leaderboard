import Vue from 'vue';

import http from './http';
import settings from './settings';

export default {
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
    getTaskById: state => taskId => state.tasks.find(aTask => aTask.id === taskId),
  },
  mutations: {
    resetChallenge(state, { challengeId }) {
      const challengeSettings = settings[challengeId];

      state.challenge.name = challengeSettings.name;
      state.tasks = challengeSettings.tasks.map((task => ({
        ...task,
        submissions: [],
        submissionsByTeam: [],
      })));
    },
    setSubmissions(state, { taskId, byTeam, submissions }) {
      const task = state.tasks.find(aTask => aTask.id === taskId);
      if (byTeam) {
        Vue.set(task, 'submissionsByTeam', submissions);
      } else {
        Vue.set(task, 'submissions', submissions);
      }
    },
    setScores(state, {
      taskId, byTeam, submissionId, scores,
    }) {
      const task = state.tasks.find(aTask => aTask.id === taskId);
      const submissions = byTeam ? task.submissionsByTeam : task.submissions;
      const submission = submissions
        .find(aSubmission => aSubmission.submission_id === submissionId);
      Vue.set(submission, 'scores', scores);
    },
  },
  actions: {
    async loadAll({ commit, dispatch, state }, { challengeId }) {
      commit('resetChallenge', { challengeId });

      const loadResults = [].concat(
        state.tasks.map(task => dispatch('loadSubmissions', { taskId: task.id, byTeam: true })),
        state.tasks.map(task => dispatch('loadSubmissions', { taskId: task.id, byTeam: false })),
      );
      await Promise.all(loadResults);
    },

    async loadSubmissions({ commit }, { taskId, byTeam }) {
      const submissionsResponse = await http.request({
        method: 'get',
        url: `leaderboard/${taskId}/${byTeam ? 'by-team' : 'by-approach'}`,
        params: {
          limit: 200,
          offset: 0,
        },
      });

      // Add an explicit rank to every submission (since they're sorted)
      const submissions = submissionsResponse.data.results.map((submission, index) => ({
        ...submission,
        rank: index + 1,
      }));

      commit('setSubmissions', { taskId, byTeam, submissions });
    },

    async loadSubmissionDetail({ commit }, { taskId, byTeam, submissionId }) {
      try {
        const submissionResponse = await http.request({
          method: 'get',
          url: `submission/${submissionId}/score`,
        });

        const scores = submissionResponse.data;

        commit('setScores', {
          taskId, byTeam, submissionId, scores,
        });
      } catch (e) {
        // TODO: log error
      }
    },
  },
};
