export default {
  formId: 'natureofWork',
  formField: {
    title: {
      name: 'name',
      label: 'Title',
      requiredErrorMsg: 'Title is required',
    },
    preparednessCheckList: {
      name: 'preparedness_checklist_id',
      label: 'Readiness Checklist',
      requiredErrorMsg: 'Readiness Checklist is required',
    },
    maintenanceCheckList: {
      name: 'task_id',
      label: 'Maintenance Checklist',
    },
    issuePermitCheckList: {
      name: 'issue_permit_checklist_id',
      label: 'Issue Permit Checklist',
    },
    ehsInstructions: {
      name: 'ehs_instructions',
      label: 'EHS Instructions',
    },
    termsAndConditions: {
      name: 'terms_conditions',
      label: 'Terms and Conditions',
    },
    approvalAuthority: {
      name: 'approval_authority_id',
      label: 'Approval Authority',
    },
    issuePermitApprovalAuthority: {
      name: 'issue_permit_approval_id',
      label: 'Issue Permit Approval Authority',
    },
    ehsAuthority: {
      name: 'ehs_authority_id',
      label: 'EHS Authority',
    },
    securityOffice: {
      name: 'security_office_id',
      label: 'Security Office',
    },
    companyId: {
      name: 'company_id',
      label: 'Company',
    },
    canBeExtended: {
      name: 'is_can_be_extended',
      label: 'Can Be Extended ?',
    },
  },
};
