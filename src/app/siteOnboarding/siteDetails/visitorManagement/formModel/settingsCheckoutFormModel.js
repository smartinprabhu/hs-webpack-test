export default {
  formId: 'VMSSettingsForm',
  formField: {
    visitorEmail: {
      name: 'has_visitor_email',
      label: 'Email',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    visitorMobile: {
      name: 'has_visitor_mobile',
      label: 'Mobile',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    visitorCompany: {
      name: 'has_visitor_company',
      label: 'Company',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    visitorType: {
      name: 'has_visitor_type',
      label: 'Type',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    visitorPurpose: {
      name: 'has_purpose',
      label: 'Purpose',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    visitorPhoto: {
      name: 'has_photo',
      label: 'Photo',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    visitorIP: {
      name: 'has_identity_proof',
      label: 'Identity Proof',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    visitorBadge: {
      name: 'has_visitor_badge',
      label: 'Badge',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    visitorIPNumber: {
      name: 'has_identity_proof_number',
      label: 'Identity Proof Number',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    idDetails: {
      name: 'has_vistor_id_details',
      label: 'Id Details',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    hostCompany: {
      name: 'has_host_company',
      label: 'Company',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    hostEmail: {
      name: 'has_host_email',
      label: 'Email',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    hostName: {
      name: 'has_host_name',
      label: 'Name',
      label1: 'Required',
      label2: 'Optional',
      label3: 'Not Required',
    },
    smsOTP: {
      name: 'is_send_otp_email',
      label: 'Email',
    },
    emailOTP: {
      name: 'is_send_otp_sms',
      label: 'SMS',
    },
    whatsappOTP: {
      name: 'is_send_whatsapp_message',
      label: 'Whatsapp Message',
    },
    emailInvitation: {
      name: 'is_send_visitor_invitation_email',
      label: 'Email',
    },
    smsInvitation: {
      name: 'is_send_visitor_invitation_sms',
      label: 'SMS',
    },
    whatsappInvitation: {
      name: 'is_send_visitor_invitation_whatsapp',
      label: 'Whatsapp Message',
    },
    enableHostEmail: {
      name: 'is_enable_host_email_verification',
      label: 'Enable Host Email Verification?',
    },
    hostDisclaimer: {
      name: 'host_disclaimer',
      label: 'Host Disclaimer Text',
    },
    enableScreen: {
      name: 'enable_prescreen',
      label: 'Enable Prescreen',
    },
    checklistScreen: {
      name: 'prescreen_checklist',
      label: 'Prescreen Checklist',
    },
    periodScreen: {
      name: 'prescreen_period',
      label: 'Prescreen Period (Hrs)',
    },
    surveyScreen: {
      name: 'prescreen_survey',
      label: 'Prescreen Survey',
    },
    buttonScreen: {
      name: 'prescreen_button_text',
      label: 'Prescreen Button Text',
    },
    emailScreen: {
      name: 'is_send_prescreen_email',
      label: 'Send Prescreen Email to Visitor​',
    },
    allowSites: {
      name: 'allowed_sites_ids',
      label: 'Allowed Host Company',
    },
    approvalHost: {
      name: 'approval_required_from_host',
      label: 'Approval Required from Host',
    },
    allowedDomains: {
      name: 'allowed_domains_host_ids',
      label: 'Allowed Domains',
    },
    closeVisit: {
      name: 'close_visit_request_by',
      label: 'Close Visit Request by (Hrs)',
    },
    externalURL: {
      name: 'enable_public_visit_request',
      label: 'Allow Visit creation using external URL​',
    },
    enableTerms: {
      name: 'is_enable_conditions ',
      label: 'Enable Terms and Conditions during Check In ​',
    },
    addTerms: {
      name: 'terms_and_conditions',
      label: 'Add Terms and Conditions​',
    },
    createdMessage: {
      name: 'visit_request_created_text',
      label: 'Visit Request Created Message​',
    },
    checkoutFeedback: {
      name: 'feedback_during_checkout',
      label: 'Feedback during Checkout​',
    },
    surveyFeedback: {
      name: 'feedback_survey',
      label: 'Feedback Survey​',
    },
    buttonFeedback: {
      name: 'feedback_button_text',
      label: 'Feedback Button Text',
    },
    emailFeedback: {
      name: 'is_send_feedback_email',
      label: 'Send Feedback Email?',
    },
    passHeader: {
      name: 'visit_pass_header',
      label: 'Visit Pass Header',
    },
    emailRequest: {
      name: 'is_send_request_email',
      label: 'Email',
    },
    smsRequest: {
      name: 'is_send_request_sms',
      label: 'SMS',
    },
    whatsappRequest: {
      name: 'is_send_request_whatsapp',
      label: 'Whatsapp Message',
    },
    emailCheckIn: {
      name: 'is_send_check_in_email',
      label: 'Email',
    },
    smsCheckIn: {
      name: 'is_send_check_in_sms',
      label: 'SMS',
    },
    whatsappCheckIn: {
      name: 'is_send_check_in_whatsapp',
      label: 'Whatsapp Message',
    },
    qrCheckIn: {
      name: 'check_in_qr',
      label: 'Unique QR',
    },
    otpCheckIn: {
      name: 'check_in_otp',
      label: 'OTP',
    },
    gracePeriodCheckIn: {
      name: 'check_in_grace_period',
      label: 'Check In Grace Period',
    },
    emailCheckOut: {
      name: 'is_send_check_out_email',
      label: 'Email',
    },
    smsCheckOut: {
      name: 'is_send_check_out_sms',
      label: 'SMS',
    },
    whatsappCheckOut: {
      name: 'is_send_check_out_whatsapp',
      label: 'Whatsapp Message',
    },
    emailApproval: {
      name: 'is_send_approval_email',
      label: 'Email',
    },
    smsApproval: {
      name: 'is_send_approval_sms',
      label: 'SMS',
    },
    whatsappApproval: {
      name: 'is_send_approval_whatsapp',
      label: 'Whatsapp Message',
    },
    emailElapsed: {
      name: 'is_send_elapsed_email',
      label: 'Email',
    },
    smsElapsed: {
      name: 'is_send_elapsed_sms',
      label: 'SMS',
    },
    whatsappElapsed: {
      name: 'is_send_elapsed_whatsapp',
      label: 'Whatsapp Message',
    },
    galleryImage: {
      name: 'allow_gallery_images',
      label: 'Allow Gallery Images',
    },
    visitorInvitationTemplateId: {
      name: 'visitor_invitation_template_id',
      label: 'Visitor Invitation Template',
    },
    otpTemplateId: {
      name: 'otp_template_id',
      label: 'OTP Template',
    },
    requestTemplateId: {
      name: 'request_template_id',
      label: 'Request Template',
    },
    checkInTemplateId: {
      name: 'check_in_template_id',
      label: 'Checkin Template',
    },
    checkOutTemplateId: {
      name: 'check_out_template_id',
      label: 'Checkout Template',
    },
    approvalTemplateId: {
      name: 'approval_template_id',
      label: 'Approval Template',
    },
    elapsedTemplateId: {
      name: 'elapsed_template_id',
      label: 'Elapsed Template',
    },
    visitorAsset: {
      name: 'is_allow_visitor_assets',
      label: 'Allow visitor assets',
    },
    visitorTypes: {
      name: 'visitor_types',
      label: 'Visitor Types',
    },
    allowedAssetType: {
      name: 'visitor_allowed_asset_ids',
      label: 'Allowed Asset Type',
    },
  },
};
