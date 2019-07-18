export default {
  2018: {
    title: 'ISIC Challenge 2018',
    stadeApiBase: process.env.VUE_APP_STADE_API_BASE,
    taskIds: {
      1: 45,
      2: 46,
      3: 47,
    },
  },
  live: {
    title: 'ISIC Live Challenge',
    stadeApiBase: process.env.VUE_APP_STADE_API_BASE,
    taskIds: {
      1: 49,
      2: 50,
      3: 51,
    },
  },
}[process.env.VUE_APP_CHALLENGE_YEAR];
