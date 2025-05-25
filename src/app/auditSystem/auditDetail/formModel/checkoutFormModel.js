export default {
  formId: 'auditActionform',
  formField: {
    title: {
      name: 'name',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
    },
    dateDeadline: {
      name: 'date_deadline',
      label: 'Date of Deadline',
      requiredErrorMsg: 'Date of Deadline is required',
    },
    userId: {
      name: 'user_id',
      label: 'Responsible User',
      requiredErrorMsg: 'Responsible User is required',
    },
  },
};
