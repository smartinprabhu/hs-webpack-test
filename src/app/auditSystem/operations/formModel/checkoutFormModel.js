export default {
  formId: 'auditSystemform',
  formField: {
    title: {
      name: 'name',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
    },
    dateAudit: {
      name: 'date',
      label: 'Date of Audit',
      requiredErrorMsg: 'Date of Audit is required',
    },
    system: {
      name: 'audit_system_id',
      label: 'System',
      requiredErrorMsg: 'System is required',
    },
    facilityManager: {
      name: 'facility_manager_id',
      label: 'Facility Manager',
    },
    facilityManagerContact: {
      name: 'facility_manager_contact',
      label: 'Facility Manager Contact',
    },
    facilityManagerEmail: {
      name: 'facility_manager_email',
      label: 'Facility Manager Email',
    },
    space: {
      name: 'space_id',
      label: 'Space',
    },
    auditorName: {
      name: 'sys_auditor_id',
      label: 'Auditor Name',
      requiredErrorMsg: 'Auditor Name is required',
    },
    auditorDesignation: {
      name: 'auditor_designation',
      label: 'Auditor Designation',
    },
    audtiorContact: {
      name: 'auditor_contact',
      label: 'Auditor Contact',
    },
    auditorEmail: {
      name: 'auditor_email',
      label: 'Auditor Email',
    },
  },
};
