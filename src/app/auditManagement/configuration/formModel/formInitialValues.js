import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    code,
    departmentId,
    Scope,
    Objective,
    auditMetricId,
    overallScore,
    pageTitle,
    questionType,
    validationErrorMsg,
    commentsMessage,
    errorMessage,
    validateMinFloat,
    validateMaxFloat,
    applicableStandardIds,
  },
} = checkoutFormModel;

export default {
  [title.name]: '',
  [code.name]: '',
  [pageTitle.name]: '',
  [validationErrorMsg.name]: 'The answer you entered has an invalid format.',
  [commentsMessage.name]: 'If other, please specify:',
  [errorMessage.name]: 'This question requires an answer.',
  [questionType.name]: 'textbox',
  [departmentId.name]: '',
  [Scope.name]: '',
  [Objective.name]: '',
  [auditMetricId.name]: '',
  [overallScore.name]: 0.00,
  [validateMinFloat.name]: '0.00',
  [validateMaxFloat.name]: '0.00',
  terms_and_conditions: '',
  instructions_to_auditee: '',
  instructions_to_auditor: '',
  [applicableStandardIds.name]: [],
};
