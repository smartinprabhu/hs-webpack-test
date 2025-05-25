export default {
  formId: 'complianceForm',
  formField: {
    name: {
      name: 'name',
      label: 'Name',
    },
    complianceTemplate: {
      name: 'compliance_id',
      label: 'Compliance Template',
      requiredErrorMsg: 'Compliance Template is required',
    },
    complianceAct: {
      name: 'compliance_act',
      label: 'Compliance Act',
    },
    complianceCategory: {
      name: 'compliance_category_id',
      label: 'Compliance Category',
    },
    submittedTo: {
      name: 'submitted_to',
      label: 'Submitted To',
    },
    appliesTo: {
      name: 'applies_to',
      label: 'Applies To',
    },
    location: {
      name: 'location_ids',
      label: 'Location *',
      requiredErrorMsg: 'Location is required',
    },
    companyId: {
      name: 'company_ids',
      label: 'Company',
      requiredErrorMsg: 'Company is required',
    },
    assetIds: {
      name: 'asset_ids',
      label: 'Asset',
      requiredErrorMsg: 'Asset is required',
    },
    responsible: {
      name: 'responsible_id',
      label: 'Responsible Team',
    },
    hasExpiry: {
      name: 'is_has_expiry',
      label: 'Has Expiry?',
    },
    nextExpiryDate: {
      name: 'next_expiry_date',
      label: 'Next Expiry Date',
      requiredErrorMsg: 'Next Expiry Date is required',
      required: true,
    },
    expirySchedule: {
      name: 'expiry_schedule',
      label: 'Expiry Schedule',
    },
    expiryScheduleType: {
      name: 'expiry_schedule_type',
      label: 'Expiry Schedule Type',
    },
    repeatUntil: {
      name: 'repeat_until',
      label: 'Repeat Until',
    },
    endDate: {
      name: 'end_date',
      label: 'End Date',
      requiredErrorMsg: 'End Date is required',
      required: true,
    },
    renewalLeadTime: {
      name: 'renewal_lead_time',
      label: 'Renewal Lead Time (Days)',
    },
    licenseNumber: {
      name: 'license_number',
      label: 'License Number',
    },
    description: {
      name: 'description',
      label: 'Description',
    },
    Type: {
      name: 'type',
      label: 'Type',
    },
    siteId: {
      name: 'company_id',
      label: 'Site',
    },
  },
};
