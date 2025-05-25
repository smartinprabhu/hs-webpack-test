import checkoutFormModel from './emailCheckoutFormModel';

const {
  formField: {
    helpdeskState,
    isRequestee,
    isMaintenanceTeam,
    isRecipients,
    recipientsName,
    isSendEmail,
    mailTemplateId,
    isPushNotify,
    isSendSms,
    smsTemplateId,
  },
} = checkoutFormModel;

export default {
  [helpdeskState.name]: '',
  [isRequestee.name]: false,
  [isMaintenanceTeam.name]: false,
  [isRecipients.name]: false,
  [recipientsName.name]: '',
  [isSendEmail.name]: false,
  [mailTemplateId.name]: '',
  [isPushNotify.name]: false,
  [isSendSms.name]: false,
  [smsTemplateId.name]: '',
};
