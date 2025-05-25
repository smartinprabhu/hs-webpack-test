export default {
  formId: 'gaugeForm',
  formField: {
    gaugeId: {
      name: 'gauge_id',
      label: 'Gauge',
      required: true,
      requiredErrorMsg: 'Gauge is required',
    },
    thresholdMin: {
      name: 'threshold_min',
      label: 'Threshold Min',
      required: true,
      placeholder: 'Enter threshold min',
      requiredErrorMsg: 'Threshold Min is required',
    },
    thresholdMax: {
      name: 'threshold_max',
      label: 'Threshold Max',
      required: true,
      placeholder: 'Enter threshold max',
      requiredErrorMsg: 'Threshold Max required',
    },
    activeType: {
      name: 'active_type',
      label: 'Active Type',
      required: true,
      requiredErrorMsg: 'Active Type is required',
    },
    createMo: {
      name: 'create_mo',
      label: 'Create Mo',
      required: false,
    },
  },
};
