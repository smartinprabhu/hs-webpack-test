export default {
  formId: 'slaAuditSystemform',
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
    auditTemplateId: {
      name: 'audit_template_id',
      label: 'Audit Template',
      requiredErrorMsg: 'Audit Template is required',
    },
  },
};
