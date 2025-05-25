import checkoutFormModel from './emailCheckoutFormModel';

const {
  formField: {
    requestState,
    messageType,
    isAuthorizer,
    isEhs,
    isVendor,
    isRequestor,
    isSecurity,
    isRecipients,
  },
} = checkoutFormModel;

export default {
  [requestState.name]: '',
  [messageType.name]: '',
  [isAuthorizer.name]: false,
  [isEhs.name]: false,
  [isVendor.name]: false,
  [isRequestor.name]: false,
  [isSecurity.name]: false,
  [isRecipients.name]: '',
};
