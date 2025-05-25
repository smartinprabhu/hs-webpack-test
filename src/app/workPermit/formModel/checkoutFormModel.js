export default {
  formId: 'workpermitform',
  formField: {
    title: {
      name: 'name',
      label: 'Description',
      requiredErrorMsg: 'Title is required',
    },
    requestor: {
      name: 'requestor_id',
      label: 'Requestor',
      requiredErrorMsg: 'Requestor is required',
    },
    typeValue: {
      name: 'type',
      label: 'Equipment',
      label1: 'Space',
    },
    equipment: {
      name: 'equipment_id',
      label: 'Equipment',
      requiredErrorMsg: 'Equipment is required',
    },
    space: {
      name: 'space_id',
      label: 'Space',
      requiredErrorMsg: 'Space is required',
    },
    maintenanceTeam: {
      name: 'maintenance_team_id',
      label: 'Maintenance Team',
      requiredErrorMsg: 'Maintenance Team is required',
    },
    vendor: {
      name: 'vendor_id',
      label: 'Vendor',
    },
    vendorPoc: {
      name: 'vendor_poc',
      label: 'Vendor POC',
    },
    vendorMobile: {
      name: 'vendor_mobile',
      label: 'Vendor Mobile',
    },
    vendorEmail: {
      name: 'vendor_email',
      label: 'Vendor Email',
    },
    workLocation: {
      name: 'work_location',
      label: 'Work Location',
      requiredErrorMsg: 'Work Location is required',
    },
    noVendorTechnicians: {
      name: 'no_vendor_technicians',
      label: 'No. of Vendor Technicians',
    },
    typeOfRequest: {
      name: 'type_of_request',
      label: 'Type of Request',
      requiredErrorMsg: 'Type of Request is required',
    },
    typeOfWork: {
      name: 'type_work_id',
      label: 'Type of Work',
      requiredErrorMsg: 'Type of Work is required',
    },
    natureOfWork: {
      name: 'nature_work_id',
      label: 'Nature of Work',
      requiredErrorMsg: 'Nature of Work is required',
    },
    departmentId: {
      name: 'department_id',
      label: 'Department',
      requiredErrorMsg: 'Department is required',
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
    durationValue: {
      name: 'duration',
      label: 'Duration (Hrs)',
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
    jobDescription: {
      name: 'job_description',
      label: 'Job Description',
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
    issuePermitAuthority: {
      name: 'issue_permit_approval_id',
      label: 'Issue Permit Authority',
    },
    ehsAuthority: {
      name: 'ehs_authority_id',
      label: 'EHS Authority',
    },
    securityOffice: {
      name: 'security_office_id',
      label: 'Security Office',
    },
    reviewer: {
      name: 'reviewer_id',
      label: 'Reviewer',
    },
  },
};
