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
    tasks: [
      {
        id: 45,
        type: 'segmentation',
        name: 'Task 1: Lesion Boundary Segmentation',
        primaryMetricName: 'Balanced Multiclass Accuracy',
      },
      {
        id: 46,
        type: 'segmentation',
        name: 'Task 2: Lesion Attribute Detection',
        primaryMetricName: 'Balanced Multiclass Accuracy',
      },
      {
        id: 47,
        type: 'classification',
        name: 'Task 3: Lesion Diagnosis',
        primaryMetricName: 'Balanced Multiclass Accuracy',
      },
    ],
  },
  live: {
    name: 'ISIC Live Challenge',
    tasks: [
      {
        id: 49,
        type: 'segmentation',
        name: 'Task 1: Lesion Boundary Segmentation',
        primaryMetricName: 'Balanced Multiclass Accuracy',
      },
      {
        id: 50,
        type: 'classification',
        name: 'Task 2: Lesion Attribute Detection',
        primaryMetricName: 'Balanced Multiclass Accuracy',
      },
      {
        id: 51,
        type: 'classification',
        name: 'Task 3: Lesion Diagnosis',
        primaryMetricName: 'Balanced Multiclass Accuracy',
      },
    ],
  },
};
