export default {
  formId: 'toolForm',
  formField: {
    nameValue: {
      name: 'name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    toolCostUnit: {
      name: 'tool_cost_unit',
      label: 'Hourly Cost Unit',
      required: true,
      requiredErrorMsg: 'Hourly Cost Unit is required',
    },
    status: {
      name: 'active',
      label: 'Active',
      required: false,
    },
  },
};
