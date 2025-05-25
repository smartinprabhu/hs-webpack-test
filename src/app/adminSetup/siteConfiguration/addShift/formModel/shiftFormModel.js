export default {
  formId: 'siteForm',
  formField: {
    nameValue: {
      name: 'name',
      label: 'Code',
      required: true,
      requiredErrorMsg: 'Code is required',
    },
    description: {
      name: 'description',
      label: 'Description',
      required: true,
      requiredErrorMsg: 'Description is required',
    },
    startTime: {
      name: 'start_time',
      label: 'Start Time (24Hr)',
      required: true,
      requiredErrorMsg: 'Start time is required',
    },
    duration: {
      name: 'duration',
      label: 'Duration',
      required: true,
      requiredErrorMsg: 'Duration is required',
    },
    lcGrace: {
      name: 'lc_grace',
      label: 'LC Grace',
      required: false,
    },
    egGrace: {
      name: 'eg_grace',
      label: 'EG Grace',
      required: false,
    },
    halfDayFrom: {
      name: 'half_day_from',
      label: 'HD From',
      required: false,
    },
    halfDayTo: {
      name: 'half_day_to',
      label: 'HD To',
      required: false,
    },
    ltPeriod: {
      name: 'lt_period',
      label: 'LT',
      required: false,
    },
  },
};
