export default {
  formId: 'extendForm',
  formField: {
    extendType: {
      name: 'extension_type',
      label: 'Future Date',
      label1: 'Current Date',
    },
    typeofRequest: {
      name: 'type_of_request',
      label: 'Type of Request',
    },
    plannedStartTime: {
      name: 'planned_start_time',
      label: 'Planned Start Time',
      requiredErrorMsg: 'Planned Start Time is required',
    },
    plannedEndTime: {
      name: 'planned_end_time',
      label: 'Planned End Time',
      requiredErrorMsg: 'Planned End Time is required',
    },
    approvalAuthority: {
      name: 'approval_authority_id',
      label: 'Approval Authority',
      requiredErrorMsg: 'Approval Authority is required',
    },
    userId: {
      name: 'user_id',
      label: 'Approval User',
      requiredErrorMsg: 'Approval User is required',
    },
  },
};
