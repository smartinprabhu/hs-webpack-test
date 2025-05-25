export default {
  formId: 'scheduleForm',
  formField: {
    activityTypeId: {
      name: 'activity_type_id',
      label: 'Activity',
      required: true,
      requiredErrorMsg: 'Activity is required',
    },
    summary: {
      name: 'summary',
      label: 'Summary',
      required: true,
      requiredErrorMsg: 'Summary is required',
    },
    dateDeadline: {
      name: 'date_deadline',
      label: 'Due Date',
      required: true,
      requiredErrorMsg: 'Due Date is required',
    },
    userId: {
      name: 'user_id',
      label: 'Assigned To',
      required: true,
      requiredErrorMsg: 'Assigned To is required',
    },
    Note: {
      name: 'note',
      label: 'Note',
      required: true,
      requiredErrorMsg: 'Note is required',
    },
  },
};
