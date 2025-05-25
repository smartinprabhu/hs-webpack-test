export default {
  formId: 'historyForm',
  formField: {
    dateValue: {
      name: 'date',
      label: 'Assigned On',
      requiredErrorMsg: 'Assigned On is Required',
    },
    dateReturnValue: {
      name: 'date',
      label: 'Returned On',
      requiredErrorMsg: 'Returned On is Required',
    },
    entityType: {
      name: 'checkout_to',
      label: 'Entity Type',
    },
    remark: {
      name: 'nature_of_work',
      label: 'Notes',
      requiredErrorMsg: 'Notes is Required',
    },
    location: {
      name: 'location_id',
      label: 'Entity',
      requiredErrorMsg: 'Entity is Required',
    },
    employeeId: {
      name: 'employee_id',
      label: 'Entity',
      requiredErrorMsg: 'Entity is Required',
    },
    assetIds: {
      name: 'asset_id',
      label: 'Entity',
      requiredErrorMsg: 'Entity is Required',
    },
  },
};
