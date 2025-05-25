export default {
  formId: 'meterForm',
  formField: {
    meterId: {
      name: 'meter_id',
      label: 'Meter',
      required: true,
      requiredErrorMsg: 'Meter is required',
    },
    theoreticalTime: {
      name: 'theoretical_time',
      label: 'Threshold Time (Hours)',
      required: true,
      placeholder: 'Enter threshold time (hours)',
      requiredErrorMsg: 'Threshold Time (Hours) is required',
    },
    theoricalUtilization: {
      name: 'theorical_utilization',
      label: 'Threshold Utilization',
      required: true,
      placeholder: 'Enter threshold utilization',
      requiredErrorMsg: 'Threshold Utilization required',
    },
    actualUtilization: {
      name: 'actual_utilization',
      label: 'Actual Utilization',
      required: true,
      placeholder: 'Enter actual utilization',
      requiredErrorMsg: 'Actual Utilization required',
    },
    resourceCalendarId: {
      name: 'resource_calendar_id',
      label: 'Equipment Working Time',
      required: true,
      requiredErrorMsg: 'Equipment Working Time required',
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
