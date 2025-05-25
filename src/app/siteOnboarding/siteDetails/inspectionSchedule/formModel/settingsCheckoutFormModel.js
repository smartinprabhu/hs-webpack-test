export default {
  formId: 'inspectionSettingsForm',
  formField: {
    overrideDuplicateInspections: {
      name: 'override_duplicate_inspections',
      label: 'Override Duplicate Inspection',
    },
    dueNowPeriod: {
      name: 'due_now_period',
      label: 'Due Now Period',
    },
    inspectionCommencedOn: {
      name: 'inspection_commenced_on',
      label: 'Site Inspection Start Date',
      requiredErrorMsg: 'Inspection Commenced On is required',
      required: true,
    },
    isAlarm: {
      name: 'is_alarm',
      label: 'Generate Alarms for Anomaly Reported',
    },
    sendEmail: {
      name: 'is_send_email',
      label: 'Send Anomaly Emails',
    },
    configJson: {
      name: 'configuration_json',
      label: 'Configuartion Json',
    },
    mailTemplateId: {
      name: 'mail_template_id',
      label: 'Anomaly Mail Template',
      requiredErrorMsg: 'Mail Template is required',
    },
    recipientsId: {
      name: 'recipients_id',
      label: 'Email Recipients List',
      requiredErrorMsg: 'Recipients Name is required',
    },
  },
};
