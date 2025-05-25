import checkoutFormModel from './emailCheckoutFormModel';

const {
  formField: {
    helpdeskState,
    isRequestee,
    isRecipients,
    recipientsName,
    isSendEmail,
    mailTemplateId,
  },
} = checkoutFormModel;

export default {
  [helpdeskState.name]: '',
  [isRequestee.name]: false,
  [isRecipients.name]: false,
  [recipientsName.name]: '',
  [isSendEmail.name]: false,
  [mailTemplateId.name]: '',
};
