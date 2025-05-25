import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    name,
    complianceCategory,
    complianceAct,
    submittedTo,
    hasExpiry,
    expirySchedule,
    expiryScheduleType,
    renewalLeadTime,
    Type,
    urlLink,
  },
} = checkoutFormModel;

export default {
  [name.name]: '',
  [complianceCategory.name]: '',
  [complianceAct.name]: '',
  [submittedTo.name]: '',
  [hasExpiry.name]: true,
  [expirySchedule.name]: '',
  [urlLink.name]: '',
  [expiryScheduleType.name]: '',
  [renewalLeadTime.name]: '',
  [Type.name]: '',
};
