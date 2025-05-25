export default {
  formId: 'helpdeskSettingsForm',
  formField: {
    hasSiteSpecificCategory: {
      name: 'has_site_specific_category',
      label: 'Configure site specific problem category',
    },
    isEnableItTicket: {
      name: 'is_enable_it_ticket',
      label: 'Allow creation of IT Tickets',
    },
    isAutoWo: {
      name: 'is_auto_generate_mo_helpdesk',
      label: 'Auto Create WO',
    },
    attachmentLimit: {
      name: 'helpdesk_attachment_limit',
      label: 'No. of attachments allowed per ticket',
    },
    sendEscalation: {
      name: 'send_escatation_mails',
      label: 'Send Escalation Mails',
    },
    sendReminder: {
      name: 'send_reminder_mails',
      label: 'Send Reminder Mails',
    },
    helpdeskFeedback: {
      name: 'is_enable_helpdesk_feedback',
      label: 'Allow user feedback',
    },
    helpdeskSurvey: {
      name: 'helpdesk_survey',
      label: 'Select Survey feedback',
    },
    buttonText: {
      name: 'helpdesk_button_text',
      label: 'Custom name for Survey  Button text in Email',
    },
    helpdeskEmail: {
      name: 'is_send_helpdesk_email',
      label: 'Send Survey in Email',
    },
    expiryDays: {
      name: 'feedback_expiry_days',
      label: 'Feedback link expiry (in days)',
    },
    feedbackTicket: {
      name: 'reopen_on_feedback_ticket',
      label: 'Reopen ticket on unsatisfied feedbacks',
    },
    emailFeedback: {
      name: 'email_team_on_dissatisfaction_feedback',
      label: 'Email maintenance team on reopened ticket',
    },
    enableExternalHelpdesk: {
      name: 'is_enable_external_helpdesk',
      label: 'Allow ticket creation using external URL',
    },
    uuidValue: {
      name: 'uuid',
      label: 'UUID',
    },
    externalUrl: {
      name: 'external_ticket_url',
      label: 'External Helpdesk URL',
    },
    verificationOtp: {
      name: 'requires_verification_by_otp',
      label: 'User requires OTP verification (SMS / Email)',
    },
    reviewerName: {
      name: 'has_reviwer_name',
      label: 'Requestor Name',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    reviewerEmail: {
      name: 'has_reviwer_email',
      label: 'Requestor Email',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    reviewerMobile: {
      name: 'has_reviwer_mobile',
      label: 'Requestor Mobile',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    attachment: {
      name: 'requires_attachment',
      label: 'Allow Attachments',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    workLocation: {
      name: 'work_location',
      label: 'Work Location',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    mobileVisibility: {
      name: 'requestor_mobile_visibility',
      label: 'Show users Mobile number',
    },
    problemCatSubCat: {
      name: 'problem_category_type',
      label: 'Problem Category/Sub Category ',
    },
    shareMailTemplate: {
      name: 'share_mail_template_id',
      label: 'Share Mail Template',
    },
    isVendorField: {
      name: 'is_vendor_field',
      label: 'Vendor',
      label1: 'Yes',
      label2: 'No',
    },
    vendorAccessType: {
      name: 'vendor_access_type',
      label: 'Vendor Access',
    },
    isAge: {
      name: 'is_age',
      label: 'Is Age?',
    },
    isConstraints: {
      name: 'is_constraints',
      label: 'Is Constraints?',
    },
    isCost: {
      name: 'is_cost',
      label: 'Is Cost?',
    },
    countDown: {
      name: 'countdown_condition',
      label: 'Countdown Condition	24 Hours',
    },
  },
};
