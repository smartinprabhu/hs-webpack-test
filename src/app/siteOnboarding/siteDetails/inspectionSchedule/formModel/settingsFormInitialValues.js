import checkoutFormModel from './settingsCheckoutFormModel';

const {
  formField: {
    overrideDuplicateInspections,
    dueNowPeriod,
    inspectionCommencedOn,
    isAlarm,
    sendEmail,
    mailTemplateId,
    recipientsId,
    configJson,
  },
} = checkoutFormModel;

export default {
  [overrideDuplicateInspections.name]: '',
  [dueNowPeriod.name]: '01:00',
  [inspectionCommencedOn.name]: '',
  [isAlarm.name]: '',
  [sendEmail.name]: '',
  [mailTemplateId.name]: '',
  [recipientsId.name]: '',
  [configJson.name]: '',
};
