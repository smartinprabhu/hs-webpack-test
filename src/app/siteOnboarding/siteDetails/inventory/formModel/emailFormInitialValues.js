import checkoutFormModel from './emailCheckoutFormModel';

const {
  formField: {
    requestState,
    typeOfOperation,
    requester,
    recipientsAdvance,
    isRecipients,
    isSendEmail,
  },
} = checkoutFormModel;

export default {
  [requestState.name]: '',
  [typeOfOperation.name]: '',
  [requester.name]: false,
  [recipientsAdvance.name]: false,
  [isRecipients.name]: '',
  [isSendEmail.name]: false,
};
