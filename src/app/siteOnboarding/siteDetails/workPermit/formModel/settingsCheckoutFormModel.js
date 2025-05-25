export default {
  formId: 'workpermitSettingsForm',
  formField: {
    workLocation: {
      name: 'work_location',
      label: 'Work Location',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    assetType: {
      name: 'asset_type',
      label: 'Asset Type',
      label1: 'Both',
      label2: 'Space',
      label3: 'Equipment',
    },
    poReference: {
      name: 'po_reference',
      label: 'PO Reference',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    partsRequired: {
      name: 'is_parts_required',
      label: 'Parts Required?',
    },
    preparedRequired: {
      name: 'is_prepared_required',
      label: 'Preparedness Required?​',
    },
    ehsRequired: {
      name: 'is_ehs_required',
      label: 'EHS Validation Required?​',
    },
    reviewRequired: {
      name: 'review_required',
      label: 'Review Required?​',
    },
    nightShiftFrom: {
      name: 'night_shift_from',
      label: 'Start Time(HH:MM)​',
    },
    nightShiftTo: {
      name: 'night_shift_to',
      label: 'End Time(HH:MM)​',
    },
    nightApproval: {
      name: 'night_approval_authority_shift_id',
      label: 'Approval Team​',
    },
    nightStart: {
      name: 'night_from_time_editable',
      label: 'Allow Edit on Start Time?',
    },
    nightEnd: {
      name: 'night_to_time_editable',
      label: 'Allow Edit on End Time?',
    },
    nightStartMax: {
      name: 'ngt_max_dur_from_time',
      label: 'Max Duration (Hrs) Start Time',
    },
    nightEndMax: {
      name: 'ngt_max_dur_to_time',
      label: 'Max Duration (Hrs) End Time',
    },
    nightTitle: {
      name: 'night_title',
      label: 'Title',
    },
    nightWorkType: {
      name: 'is_night_type_of_work',
      label: 'Is Type of work?',
    },
    specialShiftFrom: {
      name: 'special_shift_from',
      label: 'Start Time(HH:MM)​',
    },
    specialShiftTo: {
      name: 'special_shift_to',
      label: 'End Time(HH:MM)​',
    },
    specialApproval: {
      name: 'special_approval_authority_shift_id',
      label: 'Approval Team​',
    },
    specialStart: {
      name: 'special_from_time_editable',
      label: 'Allow Edit on Start Time?',
    },
    specialEnd: {
      name: 'special_to_time_editable',
      label: 'Allow Edit on End Time?',
    },
    specialStartMax: {
      name: 'spl_max_dur_from_time',
      label: 'Max Duration (Hrs) Start Time',
    },
    specialEndMax: {
      name: 'spl_max_dur_to_time',
      label: 'Max Duration (Hrs) End Time',
    },
    specialTitle: {
      name: 'special_title',
      label: 'Title',
    },
    specialWorkType: {
      name: 'is_special_type_of_work',
      label: 'Is Type of work?',
    },
    generalShiftFrom: {
      name: 'general_shift_from',
      label: 'Start Time(HH:MM)​',
    },
    generalShiftTo: {
      name: 'general_shift_to',
      label: 'End Time(HH:MM)​',
    },
    generalApproval: {
      name: 'general_approval_authority_shift_id',
      label: 'Approval Team​',
    },
    generalStart: {
      name: 'general_from_time_editable',
      label: 'Allow Edit on Start Time?',
    },
    generalEnd: {
      name: 'general_to_time_editable',
      label: 'Allow Edit on End Time?',
    },
    generalStartMax: {
      name: 'gen_max_dur_from_time',
      label: 'Max Duration (Hrs) Start Time',
    },
    generalEndMax: {
      name: 'gen_max_dur_to_time',
      label: 'Max Duration (Hrs) End Time',
    },
    generalTitle: {
      name: 'general_title',
      label: 'Title',
    },
    generalWorkType: {
      name: 'is_general_type_of_work',
      label: 'Is Type of work?',
    },
    createMessage: {
      name: 'request_message_type',
      label: 'Message Type',
      label1: 'By SMS',
      label2: 'By Email',
      label3: 'By Push Notification',
    },
    createAuthorize: {
      name: 'request_authorizer',
      label: 'To Approver​',
    },
    authorizeMessage: {
      name: 'authorized_message_type',
      label: 'Message Type',
      label1: 'By SMS',
      label2: 'By Email',
      label3: 'By Push Notification',
    },
    authorizeApprover: {
      name: 'authorized_authorizer',
      label: 'To Approver​',
    },
    authorizeEHS: {
      name: 'authorized_ehs',
      label: 'To EHS Team​',
    },
    authorizeVendor: {
      name: 'authorized_vendor',
      label: 'To Vendor​',
    },
    authorizeRequestor: {
      name: 'authorized_requestor',
      label: 'To Requestor​',
    },
    prepareMessage: {
      name: 'prepared_message_type',
      label: 'Message Type',
      label1: 'By SMS',
      label2: 'By Email',
      label3: 'By Push Notification',
    },
    prepareApprover: {
      name: 'prepared_authorizer',
      label: 'To Approver​',
    },
    prepareRequestor: {
      name: 'prepared_requestor',
      label: 'To Requestor​',
    },
    prepareEHS: {
      name: 'prepared_ehs',
      label: 'To EHS Team',
    },
    permitMessage: {
      name: 'issued_message_type',
      label: 'Message Type',
      label1: 'By SMS',
      label2: 'By Email',
      label3: 'By Push Notification',
    },
    permitApprover: {
      name: 'issued_authorizer',
      label: 'To Approver​',
    },
    permitEHS: {
      name: 'issued_ehs',
      label: 'To EHS Team​',
    },
    permitVendor: {
      name: 'issued_vendor',
      label: 'To Vendor​',
    },
    permitRequestor: {
      name: 'issued_requestor',
      label: 'To Requestor​',
    },
    permitSecurity: {
      name: 'issued_security',
      label: 'Security',
    },
    isEHSRequired: {
      name: 'is_ehs_required',
      label: 'EHS Validated Required?',
    },
    ehsEHS: {
      name: 'ehs_ehs',
      label: 'To EHS Team​',
    },
    ehsVendor: {
      name: 'ehs_vendor',
      label: 'To Vendor​',
    },
    ehsRequestor: {
      name: 'ehs_requestor',
      label: 'To Requestor​',
    },
    ehsSecurity: {
      name: 'ehs_security',
      label: 'Security',
    },
    ehsMessage: {
      name: 'ehs_message_type',
      label: 'Message Type',
      label1: 'By SMS',
      label2: 'By Email',
      label3: 'By Push Notification',
    },
    ehsApprover: {
      name: 'ehs_authorizer',
      label: 'To Approver​',
    },
    orderMessage: {
      name: 'order_message_type',
      label: 'Message Type',
      label1: 'By SMS',
      label2: 'By Email',
      label3: 'By Push Notification',
    },
    orderReview: {
      name: 'order_review',
      label: 'Review by',
    },
    orderApprover: {
      name: 'order_authorizer',
      label: 'To Approver​',
    },
    closeMessage: {
      name: 'closed_message_type',
      label: 'Message Type',
      label1: 'By SMS',
      label2: 'By Email',
      label3: 'By Push Notification',
    },
    closeApprover: {
      name: 'closed_authorizer',
      label: 'To Approver​',
    },
    closeEHS: {
      name: 'closed_ehs',
      label: 'To EHS Team​',
    },
    closeVendor: {
      name: 'closed_vendor',
      label: 'To Vendor​',
    },
    closeRequestor: {
      name: 'closed_requestor',
      label: 'To Requestor​',
    },
    closeSecurity: {
      name: 'closed_security',
      label: 'Security',
    },
    withinDay: {
      name: 'within_a_day',
      label: 'Within a day',
    },
    rStatus: {
      name: 'requested_status',
      label: 'Requested',
    },
    aStatus: {
      name: 'approved_status',
      label: 'Approved',
    },
    pStatus: {
      name: 'prepared_status',
      label: 'Prepared',
    },
    iStatus: {
      name: 'issued_permit_status',
      label: 'Issued Permit',
    },
    vStatus: {
      name: 'validated_status',
      label: 'Validated',
    },
    wStatus: {
      name: 'work_in_progress_status',
      label: 'Work In Progress',
    },
    oStatus: {
      name: 'on_hold_status',
      label: 'On Hold',
    },
    clStatus: {
      name: 'closed_status',
      label: 'Closed',
    },
    prStatus: {
      name: 'permit_rejected_status',
      label: 'Permit Rejected',
    },
    eStatus: {
      name: 'elapsed_status',
      label: 'Elapsed',
    },
    cStatus: {
      name: 'cancel_status',
      label: 'Cancel',
    },
    rButton: {
      name: 'requested_button',
      label: 'Requested',
    },
    aButton: {
      name: 'approved_button',
      label: 'Approved',
    },
    pButton: {
      name: 'prepared_button',
      label: 'Prepared',
    },
    iButton: {
      name: 'issued_permit_button',
      label: 'Issued Permit',
    },
    vButton: {
      name: 'validated_button',
      label: 'Validated',
    },
    wButton: {
      name: 'work_in_progress_button',
      label: 'Work In Progress',
    },
    oButton: {
      name: 'on_hold_button',
      label: 'On Hold',
    },
    clButton: {
      name: 'closed_button',
      label: 'Closed',
    },
    prButton: {
      name: 'permit_rejected_button',
      label: 'Permit Rejected',
    },
    eButton: {
      name: 'elapsed_button',
      label: 'Elapsed',
    },
    cButton: {
      name: 'cancel_button',
      label: 'Cancel',
    },
    actualStart: {
      name: 'edit_actual_start_dt',
      label: 'Edit Actual Start DT',
    },
    actualEnd: {
      name: 'edit_actual_end_dt',
      label: 'Edit Actual End DT',
    },
    enableType: {
      name: 'is_enable_type_of_work',
      label: 'Enable Type of work?',
    },
    workAccess: {
      name: 'type_of_work_access_level',
      label: 'Type Of Work Access Level',
    },
    enableDepartment: {
      name: 'is_enable_department',
      label: 'Enable Department?',
    },
    departmentAccess: {
      name: 'department_access_level',
      label: 'Department Access Level',
    },
  },
};
