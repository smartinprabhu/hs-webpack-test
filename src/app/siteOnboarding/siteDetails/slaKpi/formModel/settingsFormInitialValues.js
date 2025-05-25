import checkoutFormModel from './settingsCheckoutFormModel';

const {
  formField: {
    slaCategoryAccess,
    hasTarget,
    isSecondLevelApproval,
    auditAccess,
    slaJson,
  },
} = checkoutFormModel;

export default {
  [slaCategoryAccess.name]: '',
  [hasTarget.name]: '',
  [isSecondLevelApproval.name]: '',
  [auditAccess.name]: '',
  [slaJson.name]: '',
};
