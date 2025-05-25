import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    purpose,
    Reference,
    requestor,
    typeValue,
    RequestedOn,
    space,
    bearerName,
    vendorId,
    bearerReturnOn,
    bearerToReturnOn,
    bearerMobile,
    bearerEmail,
    gatePassType,
  },
} = checkoutFormModel;

export default {
  [purpose.name]: '',
  [Reference.name]: '',
  [requestor.name]: '',
  [typeValue.name]: 'Returnable',
  [RequestedOn.name]: new Date(),
  [bearerName.name]: '',
  [space.name]: '',
  [bearerReturnOn.name]: '',
  [bearerToReturnOn.name]: '',
  [bearerMobile.name]: '',
  [bearerEmail.name]: '',
  [gatePassType.name]: '',
  [vendorId.name]: '',
  date_valid: 'yes',
};
