export default {
  2019: {
    name: 'ISIC 2019 Challenge',
    tasks: [
      {
        id: 52,
        type: 'classification',
        name: 'Lesion Diagnosis: Images Only',
        primaryMetricName: 'Balanced Multiclass Accuracy',
      },
      {
        id: 53,
        type: 'classification',
        name: 'Lesion Diagnosis: Images and Metadata',
        primaryMetricName: 'Balanced Multiclass Accuracy',
      },
    ],
  },
  2018: {
    name: 'ISIC 2018 Challenge',
    taskIds: [
      45,
      46,
      47,
    ],
  },
  live: {
    name: 'ISIC Live Challenge',
    taskIds: [
      49,
      50,
      51,
    ],
  },
}[process.env.VUE_APP_CHALLENGE_YEAR];
