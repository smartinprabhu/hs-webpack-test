export default {
  formId: 'surveyForm',
  formField: {
    title: {
      name: 'title',
      label: 'Title',
      required: true,
      requiredErrorMsg: 'Title is required',
    },
    description: {
      name: 'description',
      label: 'Description',
    },
    pageTitle: {
      name: 'title',
      label: 'Page Title',
      required: true,
      requiredErrorMsg: 'Page Title is required',
    },
    questionTitle: {
      name: 'question',
      label: 'Question Name',
      required: true,
      requiredErrorMsg: 'Question Name is required',
    },
    questionType: {
      name: 'type',
      label: 'Type of Question',
    },
    mandatoryAnswer: {
      name: 'constr_mandatory',
      label: 'Mandatory Answer',
    },
    enableCondition: {
      name: 'is_enable_condition',
      label: 'Enable Condition',
    },
    errorMessage: {
      name: 'constr_error_msg',
      label: 'Error message',
    },
    validateEntry: {
      name: 'validation_required',
      label: 'Validate entry',
    },
    expectedMax: {
      name: 'validation_length_min',
      label: 'Minimum Text Length',
    },
    expectedMin: {
      name: 'validation_length_max',
      label: 'Maximum Text Length',
    },
    validateMinDate: {
      name: 'validation_min_date',
      label: 'Minimum Date',
    },
    validateMaxDate: {
      name: 'validation_max_date',
      label: 'Maximum Date',
    },
    validateMinFloat: {
      name: 'validation_min_float_value',
      label: 'Minimum Value',
    },
    validateMaxFloat: {
      name: 'validation_max_float_value',
      label: 'Maximum Value',
    },
    validationErrorMsg: {
      name: 'validation_error_msg',
      label: 'Validation Error message',
    },
    validationEmail: {
      name: 'validation_email',
      label: '​Input must be an email',
    },
    displayMode: {
      name: 'display_mode',
      label: 'Format',
    },
    noofColumns: {
      name: 'column_nb',
      label: 'Number of columns',
    },
    matrixType: {
      name: 'matrix_subtype',
      label: 'Matrix Type',
    },
    parentId: {
      name: 'parent_id',
      label: 'Question',
      required: true,
    },
    questionOption: {
      name: 'based_on_ids',
      label: 'Option',
    },
    commentsField: {
      name: 'comments_allowed',
      label: 'Show Comments Field',
    },
    commentsMessage: {
      name: 'comments_message',
      label: 'Comment Message',
    },
    commentsAnswerChoice: {
      name: 'comment_count_as_answer',
      label: 'Comment Field is an Answer Choice',
    },
    categoryType: {
      name: 'category_type',
      label: 'Type',
    },
    spaceId: {
      name: 'location_id',
      label: 'Space',
    },
    equipmentCategoryId: {
      name: 'equipment_id',
      label: 'Equipment',
    },
    verificationByOtp: {
      name: 'requires_verification_by_otp',
      label: 'Requires Verification by OTP (SMS/Email)',
    },
    reviewerName: {
      name: 'has_reviwer_name',
      label: 'Reviewers Name',
      label1: 'Required',
      label2: 'Optional',
      label3: 'None',
    },
    reviewerEmail: {
      name: 'has_reviwer_email',
      label: 'Reviewer Email',
      label1: 'Required',
      label2: 'Optional',
      label3: 'None',
    },
    reviewerMobile: {
      name: 'has_reviwer_mobile',
      label: 'Reviewer Mobile',
      label1: 'Required',
      label2: 'Optional',
      label3: 'None',
    },
    disclaimer: {
      name: 'has_disclaimer',
      label: 'Disclaimer',
      label1: 'Required',
      label2: 'Optional',
      label3: 'None',
    },
    disclaimerText: {
      name: 'disclaimer_text',
      label: 'Disclaimer Text',
    },
    feedbackText: {
      name: 'feedback_text',
      label: 'Feedback Text',
    },
    surveyTime: {
      name: 'survey_time',
      label: 'Time Taken for Survey (in Mins)',
    },
    successfulHomepageReturnTime: {
      name: 'successful_homepage_return_time',
      label: 'Successful Return to Home Page (in Seconds)',
    },
    isAllSpaces: {
      name: 'is_show_all_spaces',
      label: 'Show All Spaces',
    },
    spaceLevel: {
      name: 'space_level',
      label: 'Space Level',
    },
    hasTenant: {
      name: 'has_tenant',
      label: 'Tenant',
      label1: 'Required',
      label2: 'Optional',
      label3: 'None',
    },
    isSendEmail: {
      name: 'is_send_email',
      label: 'Send Emails',
    },
    isRepeats: {
      name: 'is_repeats',
      label: 'Repeats',
    },
    startsOn: {
      name: 'starts_on',
      label: 'Start Date',
    },
    Day: {
      name: 'day',
      label: 'Every',
    },
    recurrentRule: {
      name: 'recurrent_rule',
      label: 'Repeats On',
      required: true,
      requiredErrorMsg: 'Repeats On is required',
    },
    deadLine: {
      name: 'deadline',
      label: 'Deadline (Days)',
    },
    answeredAlready: {
      name: 'answered_already',
      label: 'Message for Survey Answered Already',
    },
    deadlineElapsed: {
      name: 'deadline_elapsed',
      label: 'Message for Deadline Elapsed',
    },
    escalationPolicyId: {
      name: 'escalation_policy_id',
      label: 'Escalation Policy',
    },
    campaignEmailId: {
      name: 'campaign_email_id',
      label: 'Campaign Email',
    },
    reminderEmailId: {
      name: 'reminder_email_id',
      label: 'Reminder Email',
    },
    recipientsIds: {
      name: 'recipients_ids',
      label: 'Recipients',
    },
    mo: {
      name: 'mo',
      label: 'Mon',
    },
    tu: {
      name: 'tu',
      label: 'Tue',
    },
    we: {
      name: 'we',
      label: 'Wed',
    },
    th: {
      name: 'th',
      label: 'Thu',
    },
    fr: {
      name: 'fr',
      label: 'Fri',
    },
    sa: {
      name: 'sa',
      label: 'Sat',
    },
    su: {
      name: 'su',
      label: 'Sun',
    },
  },
};
