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
      1: '5bee430fc5eaea4f24b5ebee',
      2: '5bee4310c5eaea4f24b5ebfd',
      3: '5bee4312c5eaea4f24b5ec0c',
    },
  },
}[process.env.VUE_APP_CHALLENGE_YEAR];
