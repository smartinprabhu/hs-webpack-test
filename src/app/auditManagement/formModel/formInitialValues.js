import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    auditSystemId,
    plannedStartDate,
    plannedEndDate,
    departmentId,
    Scope,
    auditType,
    Objective,
    auditSpocId,
    auditCategoryId,
    monthCount,
    repeatUntil,
  },
} = checkoutFormModel;

export default {
  [title.name]: '',
  [auditSystemId.name]: '',
  [plannedStartDate.name]: false,
  [plannedEndDate.name]: false,
  [auditType.name]: 'Internal',
  [departmentId.name]: '',
  [auditSpocId.name]: '',
  [Scope.name]: '',
  [Objective.name]: '',
  [auditCategoryId.name]: '',
  instructions_to_auditor: '',
  instructions_to_auditee: '',
  terms_and_conditions: '',
  audit_metric_id: false,
  [monthCount.name]: 1,
  [repeatUntil.name]: false,
  overall_score: 0.00,
  is_repeats: 'No',
  bulk_events: [],

};
