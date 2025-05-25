export default {
  formId: 'complianceTempForm',
  formField: {
    name: {
      name: 'name',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
    },
    complianceAct: {
      name: 'compliance_act',
      label: 'Compliance Act',
      requiredErrorMsg: 'Compliance Act is required',
    },
    complianceCategory: {
      name: 'compliance_category_id',
      label: 'Compliance Category',
      requiredErrorMsg: 'Compliance Category is required',
    },
    submittedTo: {
      name: 'submitted_to',
      label: 'Submitted To',
      requiredErrorMsg: 'Submitted To is required',
    },
    hasExpiry: {
      name: 'is_has_expiry',
      label: 'Has Expiry?',
    },
    expirySchedule: {
      name: 'expiry_schedule',
      label: 'Expiry Schedule',
    },
    expiryScheduleType: {
      name: 'expiry_schedule_type',
      label: 'Expiry Schedule Type',
    },
    renewalLeadTime: {
      name: 'renewal_lead_time',
      label: 'Renewal Lead Time (Days)',
    },
    Type: {
      name: 'type',
      label: 'Type',
    },
    urlLink: {
      name: 'url_link',
      label: 'URL Link',
    },
  },
};
