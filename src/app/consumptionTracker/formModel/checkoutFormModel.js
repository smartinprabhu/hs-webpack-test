export default {
  formId: 'consTrackform',
  formField: {
    title: {
      name: 'name',
      label: 'Title',
      requiredErrorMsg: 'Title is required',
    },
    dateAudit: {
      name: 'audit_date',
      label: 'Audit For',
      requiredErrorMsg: 'Audit For is required',
    },
    trackerTemplateId: {
      name: 'tracker_template_id',
      label: 'Tracker Template',
      requiredErrorMsg: 'Tracker Template is required',
    },
    startDate: {
      name: 'start_date',
      label: 'Billing Start Date*',
      requiredErrorMsg: 'Billing Start Date is required',
    },
    endDate: {
      name: 'end_date',
      label: 'Billing End Date*',
      requiredErrorMsg: 'Billing End Date is required',
    },
  },
};
