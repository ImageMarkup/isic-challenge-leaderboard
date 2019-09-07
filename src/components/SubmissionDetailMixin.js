import { mapActions, mapState } from 'vuex';

export default {
  props: {
    submission: {
      type: Object,
      required: true,
    },
  },

  created() {
    this.loadSubmissionScores({
      submissionId: this.submission.submission_id,
    });
  },

  computed: {
    ...mapState('leaderboard', {
      scores(state) {
        return state.submissionScores[this.submission.submission_id];
      },
    }),
    loading() {
      return !this.scores;
    },
  },

  methods: {
    ...mapActions('leaderboard', [
      'loadSubmissionScores',
    ]),
  },
};
