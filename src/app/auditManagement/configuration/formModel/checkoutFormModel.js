export default {
  formId: 'systemForm',
  formField: {
    title: {
      name: 'name',
      label: 'Title',
      required: true,
      requiredErrorMsg: 'Title is required',
    },
    code: {
      name: 'short_code',
      label: 'Code',
      required: true,
      requiredErrorMsg: 'Code is required',
    },
    departmentId: {
      name: 'department_id',
      label: 'Department',
      required: true,
      requiredErrorMsg: 'Department is required',
    },
    Scope: {
      name: 'scope',
      label: 'Scope',
    },
    Objective: {
      name: 'objective',
      label: 'Objective',
    },
    auditMetricId: {
      name: 'audit_metric_id',
      label: 'Metric',
    },
    overallScore: {
      name: 'overall_score',
      label: 'Overall Score %',
    },
    pageTitle: {
      name: 'title',
      label: 'Title',
      required: true,
      requiredErrorMsg: 'Title is required',
    },
    questionTitle: {
      name: 'question',
      label: 'Item Name',
      required: true,
      requiredErrorMsg: 'Item Name is required',
    },
    questionType: {
      name: 'type',
      label: 'Type of Item',
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
      label: 'Item',
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
    hasAttachment: {
      name: 'has_attachment',
      label: 'Has Attachment',
    },
    helperText: {
      name: 'helper_text',
      label: 'Helper Text',
    },
    applicableScore: {
      name: 'applicable_score',
      label: 'Applicable Score',
    },
    Procedure: {
      name: 'procedure',
      label: 'Procedure',
    },
    riskLevel: {
      name: 'risk_level',
      label: 'Risk Level',
    },
    questionGroupId: {
      name: 'question_group_id',
      label: 'Section',
      required: true,
      requiredErrorMsg: 'Section is required',
    },
    applicableStandardIds: {
      name: 'applicable_standard_ids',
      label: 'Applicable Standards',
    },
  },
};
