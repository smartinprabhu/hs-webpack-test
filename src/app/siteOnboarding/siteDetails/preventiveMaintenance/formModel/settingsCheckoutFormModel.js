export default {
  formId: 'PPMSettingsForm',
  formField: {
    atStart: {
      name: 'at_start_mro',
      label: 'At Start',
    },
    atReview: {
      name: 'at_review_mro',
      label: 'At Review',
    },
    atDone: {
      name: 'at_done_mro',
      label: 'At Done',
    },
    qrScanStart: {
      name: 'qr_scan_at_start',
      label: 'QR Scan At Start',
    },
    qrScanDone: {
      name: 'qr_scan_at_done',
      label: 'QR Scan At Done',
    },
    generatePpmAdvance: {
      name: 'generate_ppm_in_advance',
      label: 'Generate PPM in Advance(Weeks)',
      label1: '1',
      label2: '2',
    },
    enforceTime: {
      name: 'enforce_time',
      label: 'Enforce Time',
    },
    nfcScanStart: {
      name: 'nfc_scan_at_start',
      label: 'NFC Scan at Start',
    },
    nfcScanDone: {
      name: 'nfc_scan_at_done',
      label: 'NFC Scan at Done',
    },
    reviewRequired: {
      name: 'is_review_required',
      label: 'Review Required?',
    },
    reviewApproval: {
      name: 'review_role_id',
      label: 'Review Approval',
    },
    reviewComment: {
      name: 'review_commment_is_required',
      label: 'Review Comment is Required?',
    },
    signoffRequired: {
      name: 'is_sign_off_required',
      label: 'Sign off Required?',
    },
    signoffApproval: {
      name: 'sign_off_role_id',
      label: 'Sign off Approval',
    },
    subAssets: {
      name: 'is_subassets_viewer',
      label: 'Subassets in viewer?',
    },
    indirectChild: {
      name: 'is_indirect_child',
      label: 'Indirect Child?',
    },
    isParent: {
      name: 'is_parent',
      label: 'Parent?',
    },
    performMissed: {
      name: 'is_perform_missed_ppm',
      label: 'Perform Missed PPM?',
    },
    allowUsers: {
      name: 'is_provide_missed_reason',
      label: 'Allow Users to Provide Missed Reason?',
    },
    formatType: {
      name: 'service_report_file_formats',
      label: 'Service Report File formats Type',
    },
    reportReason: {
      name: 'service_report_reason_id',
      label: 'Service Report Reason',
    },
    allowExternalPPM: {
      name: 'is_external_ppm_to_be_performed',
      label: 'Allow External PPM To be Performed?',
    },
    sendExternalPPM: {
      name: 'is_send_external_ppm_email',
      label: 'Send External PPM Email?',
    },
    sendEmail: {
      name: 'send_email_before_weeks',
      label: 'Send Email Before (Weeks)',
    },
    sendCopyEmail: {
      name: 'send_email_cc_recipients_ids',
      label: 'Send a copy of Email to (cc)',
    },
    sendVendorEmail: {
      name: 'send_vendor_emails_as',
      label: 'Send Vendor Emails as',
    },
    externalEmail: {
      name: 'external_reminder_email_template_id',
      label: 'External Reminder Email Template',
    },
    restrictPPM: {
      name: 'is_fence_to_perform_ppm',
      label: 'Restrict Geo-Fence To Perform PPM?',
    },
    instructions: {
      name: 'instructions',
      label: 'Instructions',
    },
    terms: {
      name: 'terms_and_condition',
      label: 'Terms And Conditions',
    },
    disclaimer: {
      name: 'disclaimer',
      label: 'Disclaimer',
    },
    isonHoldApproval: {
      name: 'is_on_hold_approval_required',
      label: 'On-Hold Approval Required?',
    },
    onHoldMax: {
      name: 'on_hold_max_grace_period',
      label: 'On-hold Max Grace Period (in days)',
    },
    onHoldApproval: {
      name: 'on_hold_approval_id',
      label: 'On Hold Approval',
    },
    onHoldRecipients: {
      name: 'on_hold_recipients',
      label: 'On Hold Recipients',
    },
    onHoldRequest: {
      name: 'on_hold_mail_template_id',
      label: 'On Hold Request Approval Mail',
    },
    onHoldMail: {
      name: 'on_hold_mail_reject_id',
      label: 'On Hold Approval/Reject Mail',
    },
    onHoldTemplate: {
      name: 'on_hold_missed_mail_id',
      label: 'On-Hold Request Missed Template',
    },
    remainderMail: {
      name: 'reminder_template_id',
      label: 'Reminder Mail Template',
    },
    slaMail: {
      name: 'sla_template_id',
      label: 'SLA Mail Template',
    },
    reasonAccess: {
      name: 'reason_access_level',
      label: 'Reason Access Level',
    },
  },
};
