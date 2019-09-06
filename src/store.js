import Vue from 'vue';

import http from './http';

export default {
  state: {
    challenge: {
      id: null,
      name: '',
    },
    tasks: {},
    submissionScores: {},
  },
  getters: {
    getTaskById: state => taskId => state.tasks.find(aTask => aTask.id === taskId),
  },
  mutations: {
    setChallenge(state, { challenge }) {
      state.challenge.id = challenge.id;
      state.challenge.name = challenge.name;
      state.tasks = challenge.tasks.map((task => ({
        ...task,
        // TODO: This hardcoding of primaryMetricName is not always accurate
        primaryMetricName:
          task.type === 'classification' ? 'Balanced Multiclass Accuracy' : 'Jaccard',
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
    setSubmissionScores(state, {
      submissionId, scores,
    }) {
      Vue.set(state.submissionScores, submissionId, scores);
    },
  },
  actions: {
    async loadChallenge({ commit, dispatch, state }, { challengeId }) {
      const challengeResponse = await http.request({
        method: 'get',
        url: `challenge/${challengeId}`,
      });
      const challenge = challengeResponse.data;
      commit('setChallenge', { challenge });

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

    async loadSubmissionScores({ commit, state }, { submissionId }) {
      if (state.submissionScores[submissionId]) {
        // Don't refech if cached
        return;
      }

      const submissionResponse = await http.request({
        method: 'get',
        url: `submission/${submissionId}/score`,
      });

      const scores = submissionResponse.data;

      commit('setSubmissionScores', {
        submissionId, scores,
      });
    },
  },
};
