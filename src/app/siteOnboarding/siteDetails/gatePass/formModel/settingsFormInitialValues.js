import checkoutFormModel from './settingsCheckoutFormModel';

const {
  formField: {
    bearerEmail,
    bearerMobile,
    attachment,
    space,
    reference,
    referenceDisplay,
    approvalRequired,
    approvalButton,
    approvalRecipients,
    company,
    uuId,
  },
} = checkoutFormModel;

export default {
  [bearerEmail.name]: '',
  [bearerMobile.name]: '',
  [attachment.name]: '',
  [space.name]: '',
  [reference.name]: '',
  [referenceDisplay.name]: '',
  [approvalRequired.name]: '',
  [approvalButton.name]: '',
  [approvalRecipients.name]: '',
  [company.name]: '',
  [uuId.name]: '',
};
