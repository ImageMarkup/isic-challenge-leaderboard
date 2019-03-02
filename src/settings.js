export default {
  2018: {
    title: 'ISIC Challenge 2018',
    covalicApiBase: 'https://challenge.kitware.com/api/v1/',
    taskIds: {
      1: '5b1c193356357d41064da2ec',
      2: '5b1c1a9f56357d41064da2f6',
      3: '5b1c1aa756357d41064da300',
    },
  },
  live: {
    title: 'ISIC Live Challenge',
    covalicApiBase: 'https://submission.challenge.isic-archive.com/api/v1/',
    taskIds: {
      1: '5bee430fc5eaea4f24b5ebee',
      2: '5bee4310c5eaea4f24b5ebfd',
      3: '5bee4312c5eaea4f24b5ec0c',
    },
  },
}[process.env.VUE_APP_CHALLENGE_YEAR];
