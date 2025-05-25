export default {
  formId: 'visitormanagementForm',
  formField: {
    visitFor: {
      name: 'visit_for',
      label: 'Other',
      label1: 'Self',
    },
    refName: {
      name: 'name',
      label: 'Reference',
    },
    visitorType: {
      name: 'type_of_visitor',
      label: 'Type',
      requiredErrorMsg: 'Type is required',
    },
    nameValue: {
      name: 'visitor_name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    visitorPhoto: {
      name: 'image_medium',
      label: 'Photo*',
      required: true,
      requiredErrorMsg: 'Photo is required',
    },
    mobile: {
      name: 'phone',
      label: 'Mobile',
      requiredErrorMsg: 'Mobile is required',
    },
    email: {
      name: 'email',
      label: 'Email',
      requiredErrorMsg: 'Email is required',
    },
    organization: {
      name: 'organization',
      label: 'Visitor Company',
      requiredErrorMsg: 'Visitor Company is required',
    },
    idProof: {
      name: 'id_proof',
      label: 'ID Proof',
      requiredErrorMsg: 'Id proof type is required',
    },
    idDetails: {
      name: 'Visitor_id_details',
      label: 'ID Proof Number',
      requiredErrorMsg: 'Id details is required',
      placeholder: 'Enter last 4 digits of ID proof',
    },
    documentProof: {
      name: 'attachment',
      label: 'Attachment',
      requiredErrorMsg: 'Id proof is required',
    },
    employeeId: {
      name: 'employee_id',
      label: 'Employee',
    },
    employeePhoto: {
      name: 'employee_image',
      label: 'Photo',
    },
    employeeMobile: {
      name: 'employee_phone',
      label: 'Mobile',
    },
    employeeEmail: {
      name: 'employee_email',
      label: 'Email',
    },
    hostName: {
      name: 'host_name',
      label: 'Host Name',
      required: true,
      requiredErrorMsg: 'Host Name is required',
    },
    hostEmail: {
      name: 'host_email',
      label: 'Host Email',
      requiredErrorMsg: 'Host Email is required',
    },
    hostCompany: {
      name: 'allowed_sites_id',
      label: 'Allowed Host Company*',
      requiredErrorMsg: 'Host Company is required',
    },
    plannedIn: {
      name: 'planned_in',
      label: 'Planned In',
      requiredErrorMsg: 'Planned In is required',
      required: true,
    },
    plannedOut: {
      name: 'planned_out',
      label: 'Planned Out',
    },
    spaceId: {
      name: 'space_id',
      label: 'Space',
    },
    actualIn: {
      name: 'actual_in',
      label: 'Actual In',
    },
    actualOut: {
      name: 'actual_out',
      label: 'Actual Out',
    },
    purpose: {
      name: 'purpose',
      label: 'Purpose',
      requiredErrorMsg: 'Purpose is required',
    },
    entryStatus: {
      name: 'entry_status',
      label: 'Entry Status',
    },
    allowMultipleEntry: {
      name: 'allow_multiple_entry',
      label: 'Allow Multiple Entry',
    },
    tenantId: {
      name: 'tenant_id',
      label: 'Visiting Company',
      requiredErrorMsg: 'Visiting Company is required',
    },
  },
};
