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
      },
      2: {
        id: settings.taskIds[2],
        name: 'Lesion Attribute Detection',
        phase: null,
        submissions: [],
      },
      3: {
        id: settings.taskIds[3],
        name: 'Lesion Diagnosis',
        phase: null,
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
  },
});
